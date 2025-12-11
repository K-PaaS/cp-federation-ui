import { Flex } from '@/components/Flex';
import { Heading } from '@/components/Heading';
import Pagination from '@/components/Pagination';
import { ProgressWithMarker } from '@/components/ProgressWithMarker';
import { Status } from '@/components/Status';
import { Table } from '@/components/Table';
import { DEFAULT_PAGE, DEFAULT_SORT } from '@/constants/search';
import { Cluster } from '@/pages/Clusters/models/clusters';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getClusterListQueryOption } from '../../query-options/clusters';
import ClusterExcludeButton from './ClusterExcludeButton';
import ClusterSyncButton from './ClusterSyncButton';
import ClusterViewButton from './ClusterViewButton';

export default function ClusterList() {
  const itemsPerPage = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sortBy') || DEFAULT_SORT;
  const filterBy = searchParams.get('filterBy') ?? '';
  const page = Number(searchParams.get('page') ?? DEFAULT_PAGE);
  const setCurrentPage = (page: number) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  const { data: clusterList } = useSuspenseQuery(
    getClusterListQueryOption({ filterBy, page, itemsPerPage, sort })
  );

  if (clusterList.clusters.length === 0) {
    return (
      <Heading variant='center' marginTop='10%'>
        클러스터가 없습니다.
      </Heading>
    );
  }

  return (
    <>
      <Table.Root tableLayout='fixed'>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader width='10%'>Name</Table.ColumnHeader>
            <Table.ColumnHeader width='10%'>
              Kubernetes Version
            </Table.ColumnHeader>
            <Table.ColumnHeader width='10%'>Cluster Status</Table.ColumnHeader>
            <Table.ColumnHeader width='10%'>Node Status</Table.ColumnHeader>
            <Table.ColumnHeader width='20%'>CPU Usage</Table.ColumnHeader>
            <Table.ColumnHeader width='20%'>Memory Usage</Table.ColumnHeader>
            <Table.ColumnHeader width='20%'>Operation</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {clusterList.clusters.map((cluster: Cluster) => (
            <Table.Row key={cluster.uid}>
              <Table.Cell>{cluster.name}</Table.Cell>
              <Table.Cell>{cluster.kubernetesVersion}</Table.Cell>
              <Table.Cell>
                <Flex justify='center'>
                  <Status variant={cluster.status} />
                </Flex>
              </Table.Cell>
              <Table.Cell>
                {cluster.nodeSummary.readyNum}/{cluster.nodeSummary.totalNum}
              </Table.Cell>
              <Table.Cell>
                <ProgressWithMarker
                  realTimeUsage={cluster.realTimeUsage.cpu}
                  requestUsage={cluster.requestUsage.cpu}
                  kind='CPU'
                />
              </Table.Cell>
              <Table.Cell>
                <ProgressWithMarker
                  realTimeUsage={cluster.realTimeUsage.memory}
                  requestUsage={cluster.requestUsage.memory}
                  kind='Memory'
                />
              </Table.Cell>
              <Table.Cell>
                <Flex justify='space-evenly'>
                  <ClusterViewButton clusterId={cluster.clusterId} />
                  <ClusterExcludeButton
                    clusterId={cluster.clusterId}
                    clusterName={cluster.name}
                  />
                  <ClusterSyncButton
                    clusterStatus={cluster.status}
                    clusterId={cluster.clusterId}
                    clusterName={cluster.name}
                  />
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        totalItemCount={clusterList.listMeta.totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={page}
        onPageChange={page => setCurrentPage(page)}
      />
    </>
  );
}
