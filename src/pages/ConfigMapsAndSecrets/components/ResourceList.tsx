import { Flex } from '@/components/Flex';
import { Heading } from '@/components/Heading';
import Pagination from '@/components/Pagination';
import { Table } from '@/components/Table';
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_SORT,
} from '@/constants/search';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ConfigMapAndSecretLowercase } from '../models/configMapsAndSecrets';
import { getResourceListQueryOptions } from '../query-options';

interface ResourceListProps {
  kind: ConfigMapAndSecretLowercase;
  DeleteButton: React.ComponentType<{ namespace: string; name: string }>;
  ViewButton: React.ComponentType<{ namespace: string; name: string }>;
}

export default function ResourceList({
  kind,
  DeleteButton,
  ViewButton,
}: ResourceListProps) {
  const itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || DEFAULT_SORT;
  const filterBy = searchParams.get('filterBy') || '';
  const namespace = searchParams.get('namespace') || '';
  const currentPage = Number(searchParams.get('page') || DEFAULT_PAGE);

  const setCurrentPage = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  };

  const { data: resourceList } = useSuspenseQuery(
    getResourceListQueryOptions({
      kind,
      namespace,
      filterBy,
      page: currentPage,
      itemsPerPage,
      sort: sortBy,
    })
  );

  if (resourceList.resources.length === 0) {
    return (
      <Heading variant='center' marginTop='10%'>
        결과가 없습니다.
      </Heading>
    );
  }

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Namespace</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Policies</Table.ColumnHeader>
            <Table.ColumnHeader>Operation</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {resourceList.resources.map(resource => (
            <Table.Row key={`${resource.namespace}-${resource.name}`}>
              <Table.Cell>{resource.namespace}</Table.Cell>
              <Table.Cell>{resource.name}</Table.Cell>
              <Table.Cell>{resource.policy.name}</Table.Cell>
              <Table.Cell>
                <Flex justify='space-evenly'>
                  <ViewButton
                    namespace={resource.namespace}
                    name={resource.name}
                  />
                  <DeleteButton
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
        totalItemCount={resourceList.listMeta.totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

