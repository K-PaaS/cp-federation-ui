import { Flex } from '@/components/Flex';
import SortSelect from '@/components/SortSelect';
import { WorkloadKindLowercase } from '@/models/commonModels';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import CronJobList from './components/CronJobList';
import DaemonSetList from './components/DaemonSetList';
import DeploymentList from './components/DeploymentList';
import JobList from './components/JobList';
import StatefulSetList from './components/StatefulSetList';
import WorkloadAddButton from './components/WorkloadAddButton';
import WorkloadLevelSelect from './components/WorkloadLevelSelect';
import WorkloadNamespaceSelect from './components/WorkloadNamespaceSelect';

export default function Workloads() {
  const [searchParams, setSearchParams] = useSearchParams();
  const workloadLevel = searchParams.get('kind') ?? 'deployment';

  const onWorkloadChange = (next: WorkloadKindLowercase) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('kind', next);
      newParams.delete('page');
      return newParams;
    });
  };

  return (
    <>
      <Flex
        justify='space-between'
        align='center'
        marginTop='9px'
        marginBottom='50px'
      >
        <Flex>
          <WorkloadLevelSelect
            value={workloadLevel as WorkloadKindLowercase}
            onValueChange={onWorkloadChange}
          />
          <WorkloadNamespaceSelect />
        </Flex>
        <Flex justify='flex-end'>
          <SearchBar key={workloadLevel} />
          <WorkloadAddButton />
        </Flex>
      </Flex>
      <Flex justify='flex-end'>
        <SortSelect key={workloadLevel} level={'namespace'} />
      </Flex>
      <ErrorBoundary fallbackRender={({ error }) => <div>{error.message}</div>}>
        <Suspense fallback=''>
          {workloadLevel === 'deployment' ? (
            <DeploymentList />
          ) : workloadLevel === 'statefulset' ? (
            <StatefulSetList />
          ) : workloadLevel === 'daemonset' ? (
            <DaemonSetList />
          ) : workloadLevel === 'cronjob' ? (
            <CronJobList />
          ) : workloadLevel === 'job' ? (
            <JobList />
          ) : (
            <div>No workload found</div>
          )}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
