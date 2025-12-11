import { Flex } from '@/components/Flex';
import { Heading } from '@/components/Heading';
import Pagination from '@/components/Pagination';
import { Table } from '@/components/Table';
import { Resource } from '@/pages/Workloads/models/workload';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getResourceListQueryOption } from '../../query-options/workload';
import StatefulSetDeleteButton from './StatefulSetDeleteButton';
import StatefulSetViewButton from './StatefulSetViewButton';

export default function StatefulSetList() {
  const itemsPerPage = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sortBy') || '';
  const filterBy = searchParams.get('filterBy') || '';
  const namespace = searchParams.get('namespace') || '';
  const kind = searchParams.get('kind') ?? 'statefulset';
  const currentPage = Number(searchParams.get('page') ?? '1');
  const setCurrentPage = (page: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', page.toString());
      return next;
    });
  };

  const { data: statefulSetList } = useSuspenseQuery(
    getResourceListQueryOption({
      kind: kind as 'statefulset',
      namespace,
      filterBy,
      page: currentPage,
      itemsPerPage,
      sort,
    })
  );

  if (statefulSetList.resources.length === 0) {
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
            <Table.ColumnHeader width='40%'>Name</Table.ColumnHeader>
            <Table.ColumnHeader width='20%'>Policies</Table.ColumnHeader>
            <Table.ColumnHeader width='20%'>Operation</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {statefulSetList.resources.map((resource: Resource) => (
            <Table.Row key={`${resource.namespace}-${resource.name}`}>
              <Table.Cell>{resource.namespace}</Table.Cell>
              <Table.Cell>{resource.name}</Table.Cell>
              <Table.Cell>{resource.policy.name}</Table.Cell>
              <Table.Cell>
                <Flex justify='space-evenly'>
                  <StatefulSetViewButton
                    namespace={resource.namespace}
                    name={resource.name}
                  />
                  <StatefulSetDeleteButton
                    namespace={resource.namespace}
                    name={resource.name}
                  />
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        totalItemCount={statefulSetList.listMeta.totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={page => setCurrentPage(page)}
      />
    </>
  );
}
