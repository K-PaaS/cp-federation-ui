import { Flex } from '@/components/Flex';
import { Heading } from '@/components/Heading';
import Pagination from '@/components/Pagination';
import { Table } from '@/components/Table';
import { PropagationPolicy } from '@/pages/Policies/models/propagationPolicy';
import { Box, Tag, VStack } from '@chakra-ui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getPropagationPolicyListQueryOption } from '../../query-options/policy';
import PropagationPolicyDeleteButton from './PropagationPolicyDeleteButton';
import PropagationPolicyViewButton from './PropagationPolicyViewButton';

export default function PropagationPolicyList() {
  const itemsPerPage = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sortBy') || '';
  const filterBy = searchParams.get('filterBy') || '';
  const namespace = searchParams.get('namespace') || '';
  const currentPage = Number(searchParams.get('page') ?? '1');
  const setCurrentPage = (page: number) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  const { data: propagationPolicyList } = useSuspenseQuery(
    getPropagationPolicyListQueryOption({
      namespace,
      filterBy,
      page: currentPage,
      itemsPerPage,
      sort,
    })
  );

  if (propagationPolicyList.propagationPolicies.length === 0) {
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
            <Table.ColumnHeader width='20%'>Namespace</Table.ColumnHeader>
            <Table.ColumnHeader width='30%'>Name</Table.ColumnHeader>
            <Table.ColumnHeader width='15%'>
              Conflict Resolution
            </Table.ColumnHeader>
            <Table.ColumnHeader width='15%'>
              Affected Clusters
            </Table.ColumnHeader>
            <Table.ColumnHeader width='20%'>Operation</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {propagationPolicyList.propagationPolicies.map(
            (propagationPolicy: PropagationPolicy) => (
              <Table.Row key={propagationPolicy.uid}>
                <Table.Cell>{propagationPolicy.namespace}</Table.Cell>
                <Table.Cell>{propagationPolicy.name}</Table.Cell>
                <Table.Cell>{propagationPolicy.conflictResolution}</Table.Cell>
                <Table.Cell>
                  <VStack>
                    {propagationPolicy.relatedClusters.length !== 0 ? (
                      propagationPolicy.relatedClusters.map(
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
                    <PropagationPolicyViewButton
                      namespace={propagationPolicy.namespace}
                      name={propagationPolicy.name}
                    />
                    <PropagationPolicyDeleteButton
                      namespace={propagationPolicy.namespace}
                      name={propagationPolicy.name}
                    />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            )
          )}
        </Table.Body>
      </Table.Root>
      <Pagination
        totalItemCount={propagationPolicyList.listMeta.totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={page => setCurrentPage(page)}
      />
    </>
  );
}
