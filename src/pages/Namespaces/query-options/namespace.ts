import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_SORT,
} from '@/constants/search';
import { PaginationParams } from '@/models/commonModels';
import { queryOptions } from '@tanstack/react-query';
import { getNamespaceDetailApi, getNamespaceListApi } from '../apis/namespace';

export const getNamespaceDetailQueryOptions = ({ name }: { name: string }) =>
  queryOptions({
    queryKey: ['getNamespaceDetailApi', name],
    queryFn: () => getNamespaceDetailApi({ name }),
  });
export const getNamespaceListQueryOptions = ({
  filterBy,
  page = DEFAULT_PAGE,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  sort = DEFAULT_SORT,
}: PaginationParams) =>
  queryOptions({
    queryKey: ['getNamespaceListApi', filterBy, page, itemsPerPage, sort],
    queryFn: () => {
      return getNamespaceListApi({
        filterBy,
        page,
        itemsPerPage,
        sort,
      });
    },
  });
