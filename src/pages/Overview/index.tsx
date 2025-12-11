import { useSuspenseQuery } from '@tanstack/react-query';
import FederationInfo from './components/FederationInfo';
import HostClusterInfo from './components/HostClusterInfo';
import MemberClusterInfo from './components/MemberClusterInfo';
import { getOverviewQueryOption } from './query-options/overview';

export default function Overview() {
  const { data: overview } = useSuspenseQuery(getOverviewQueryOption());

  return (
    <>
      <FederationInfo resources={overview.clusterResourceStatus} />
      <HostClusterInfo hostCluster={overview.hostClusterStatus} />
      <MemberClusterInfo memberClusters={overview.memberClusterStatus} />
    </>
  );
}
