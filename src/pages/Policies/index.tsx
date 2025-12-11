import { Flex } from '@/components/Flex';
import SearchBar from '@/components/SearchBar';
import SortSelect from '@/components/SortSelect';
import { Level } from '@/models/commonModels';
import ClusterPropagationPolicyList from '@/pages/Policies/components/ClusterPropagationPolicyList';
import NamespaceSelect from '@/pages/Policies/components/NamespaceSelect';
import PolicyAddButton from '@/pages/Policies/components/PolicyAddButton';
import PolicyLevelSelect from '@/pages/Policies/components/PolicyLevelSelect';
import PropagationPolicyList from '@/pages/Policies/components/PropagationPolicyList';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSearchParams } from 'react-router-dom';
import { clusterListQueryOption } from '../Clusters/query-options/clusters';

export default function Policies() {
  const [policyLevel, setPolicyLevel] = useState<Level>('namespace');
  const [, setSearchParams] = useSearchParams();

  const { data: clusterList } = useSuspenseQuery(clusterListQueryOption());

  useEffect(() => {
    setSearchParams({});
  }, [policyLevel]);

  return (
    <>
      <Flex
        justify='space-between'
        align='center'
        marginTop='9px'
        marginBottom='50px'
      >
        <Flex>
          <PolicyLevelSelect
            value={policyLevel}
            onValueChange={policyLevel => setPolicyLevel(policyLevel)}
          />
          {policyLevel === 'namespace' ? <NamespaceSelect /> : null}
        </Flex>
        <Flex justify='flex-end'>
          <SearchBar key={policyLevel} />
          {clusterList.listMeta.totalItems > 0 ? <PolicyAddButton /> : null}
        </Flex>
      </Flex>
      <Flex justify='flex-end'>
        <SortSelect key={policyLevel} level={policyLevel} />
      </Flex>
      <ErrorBoundary fallbackRender={({ error }) => <div>{error.message}</div>}>
        <Suspense fallback=''>
          {policyLevel === 'namespace' ? (
            <PropagationPolicyList />
          ) : (
            <ClusterPropagationPolicyList />
          )}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
