import { Flex } from '@/components/Flex';
import { Heading } from '@/components/Heading';
import Pagination from '@/components/Pagination';
import { Table } from '@/components/Table';
import { Resource } from '@/pages/Workloads/models/workload';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getResourceListQueryOption } from '../../query-options/workload';
import DeploymentDeleteButton from './DeploymentDeleteButton';
import DeploymentViewButton from './DeploymentViewButton';

export default function DeploymentList() {
  const itemsPerPage = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sortBy') || '';
  const filterBy = searchParams.get('filterBy') || '';
  const namespace = searchParams.get('namespace') || '';
  const currentPage = Number(searchParams.get('page') ?? '1');
  const kind = searchParams.get('kind') ?? 'deployment';
  const setCurrentPage = (page: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', page.toString());
      return next;
    });
  };

  const { data: deploymentList } = useSuspenseQuery(
    getResourceListQueryOption({
      kind: kind as 'deployment',
      namespace,
      filterBy,
      page: currentPage,
      itemsPerPage,
      sort,
    })
  );

  if (deploymentList.resources.length === 0) {
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
          {deploymentList.resources.map((resource: Resource) => (
            <Table.Row key={`${resource.namespace}-${resource.name}`}>
              <Table.Cell>{resource.namespace}</Table.Cell>
              <Table.Cell>{resource.name}</Table.Cell>
              <Table.Cell>{resource.policy.name}</Table.Cell>
              <Table.Cell>
                <Flex justify='space-evenly'>
                  <DeploymentViewButton
                    namespace={resource.namespace}
                    name={resource.name}
                  />
                  <DeploymentDeleteButton
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
        totalItemCount={deploymentList.listMeta.totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={page => setCurrentPage(page)}
      />
    </>
  );
}
