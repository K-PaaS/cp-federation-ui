import { Flex } from '@/components/Flex';
import { Heading } from '@/components/Heading';
import Pagination from '@/components/Pagination';
import { Table } from '@/components/Table';
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_SORT,
} from '@/constants/search';
import { Namespace } from '@/pages/Namespaces/models/namespace';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getNamespaceListQueryOptions } from '../../query-options/namespace';
import NamespaceDeleteButton from './NamespaceDeleteButton';
import NamespaceViewButton from './NamespaceViewButton';

export default function NamespaceList() {
  const itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sortBy') || DEFAULT_SORT;
  const filterBy = searchParams.get('filterBy') || '';
  const page = Number(searchParams.get('page') ?? DEFAULT_PAGE);
  const setCurrentPage = (page: number) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  const { data: namespaceList } = useSuspenseQuery(
    getNamespaceListQueryOptions({
      filterBy,
      page,
      itemsPerPage,
      sort,
    })
  );
  if (namespaceList.namespaces.length === 0) {
    return (
      <Heading variant='center' marginTop='10%'>
        네임스페이스가 없습니다.
      </Heading>
    );
  }
  return (
    <>
      <Table.Root tableLayout='fixed'>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader width='45%'>Name</Table.ColumnHeader>
            <Table.ColumnHeader width='15%'>Status</Table.ColumnHeader>
            <Table.ColumnHeader width='20%'>Creation Time</Table.ColumnHeader>
            <Table.ColumnHeader width='20%'>Operation</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {namespaceList.namespaces.map((namespace: Namespace) => (
            <Table.Row key={namespace.name}>
              <Table.Cell>{namespace.name}</Table.Cell>
              <Table.Cell>{namespace.status}</Table.Cell>
              <Table.Cell>{namespace.created}</Table.Cell>
              <Table.Cell>
                <Flex justify='space-evenly'>
                  <NamespaceViewButton name={namespace.name} />
                  <NamespaceDeleteButton name={namespace.name} />
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        totalItemCount={namespaceList.listMeta.totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={page}
        onPageChange={page => setCurrentPage(page)}
      />
    </>
  );
}
