import { Flex } from '@/components/Flex';
import { Heading } from '@/components/Heading';
import Pagination from '@/components/Pagination';
import { Table } from '@/components/Table';
import { ClusterPropagationPolicy } from '@/pages/Policies/models/clusterPropagationPolicy';
import { Box, Tag, VStack } from '@chakra-ui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getClusterPropagationPolicyListQueryOption } from '../../query-options/policy';
import ClusterPropagationPolicyDeleteButton from './ClusterPropagationPolicyDeleteButton';
import ClusterPropagationPolicyViewButton from './ClusterPropagationPolicyViewButton';

export default function ClusterPropagationPolicyList() {
  const itemsPerPage = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sortBy') || undefined;
  const filterBy = searchParams.get('filterBy') || undefined;
  const currentPage = Number(searchParams.get('page') ?? '1');
  const setCurrentPage = (page: number) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  const { data: clusterPropagationPolicyList } = useSuspenseQuery(
    getClusterPropagationPolicyListQueryOption({
      filterBy,
      page: currentPage,
      itemsPerPage,
      sort,
    })
  );

  if (clusterPropagationPolicyList.clusterPropagationPolicies.length === 0) {
    return (
      <Heading variant='center' marginTop='10%'>
        결과가 없습니다.
      </Heading>
    );
  }

  return (
    <>
      <Table.Root tableLayout='fixed'>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader width='40%'>Name</Table.ColumnHeader>
            <Table.ColumnHeader width='15%'>
              Conflict Resolution
            </Table.ColumnHeader>
            <Table.ColumnHeader width='20%'>
              Affected Clusters
            </Table.ColumnHeader>
            <Table.ColumnHeader width='20%'>Operation</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {clusterPropagationPolicyList.clusterPropagationPolicies.map(
            (clusterPropagationPolicy: ClusterPropagationPolicy) => (
              <Table.Row key={clusterPropagationPolicy.uid}>
                <Table.Cell>{clusterPropagationPolicy.name}</Table.Cell>
                <Table.Cell>
                  {clusterPropagationPolicy.conflictResolution}
                </Table.Cell>
                <Table.Cell>
                  <VStack>
                    {clusterPropagationPolicy?.relatedClusters.length !== 0 ? (
                      clusterPropagationPolicy.relatedClusters.map(
                        (relatedCluster, index) => (
                          <Tag.Root key={index} margin={0.5}>
                            <Tag.Label>{relatedCluster}</Tag.Label>
                          </Tag.Root>
                        )
                      )
                    ) : (
                      <Box>-</Box>
                    )}
                  </VStack>
                </Table.Cell>
                <Table.Cell>
                  <Flex justify='space-evenly'>
                    <ClusterPropagationPolicyViewButton
                      name={clusterPropagationPolicy.name}
                    />
                    <ClusterPropagationPolicyDeleteButton
                      name={clusterPropagationPolicy.name}
                    />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            )
          )}
        </Table.Body>
      </Table.Root>
      <Pagination
        totalItemCount={clusterPropagationPolicyList.listMeta.totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={page => setCurrentPage(page)}
      />
    </>
  );
}
