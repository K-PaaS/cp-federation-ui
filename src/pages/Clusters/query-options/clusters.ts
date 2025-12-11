import { queryOptions } from '@tanstack/react-query';
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_SORT,
} from '../../../constants/search';
import { PaginationParams } from '../../../models/commonModels';
import {
  getClusterDetailApi,
  getClusterListApi,
  getRegisterableClusterListApi,
} from '../apis/cluster';
import { getSyncListApi } from '../apis/sync';

export const clusterListQueryOption = () =>
  queryOptions({
    queryKey: ['clusterListQueryOption'],
    queryFn: () => {
      return getClusterListApi({});
    },
  });

export const getClusterListQueryOption = ({
  filterBy,
  page = DEFAULT_PAGE,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  sort = DEFAULT_SORT,
}: PaginationParams) =>
  queryOptions({
    queryKey: ['getClusterListApi', filterBy, page, itemsPerPage, sort],
    queryFn: () => {
      return getClusterListApi({
        filterBy,
        page,
        itemsPerPage,
        sort,
      });
    },
  });

export const getRegisterableClusterListQueryOption = () =>
  queryOptions({
    queryKey: ['registerableClusterList'],
    queryFn: () => getRegisterableClusterListApi(),
  });

export const getSyncListQueryOptions = ({ clusterId }: { clusterId: string }) =>
  queryOptions({
    queryKey: ['getSyncListApi', clusterId, 'namespace'],
    queryFn: () => getSyncListApi({ clusterId, kind: 'namespace' }),
  });

export const getSyncListQueryOption = ({
  clusterId,
  namespace,
  kind,
}: {
  clusterId: string;
  namespace: string;
  kind: string;
}) =>
  queryOptions({
    queryKey: ['getSyncListApi', clusterId, namespace, kind],
    queryFn: () =>
      getSyncListApi({
        clusterId,
        namespace,
        kind: kind.toLowerCase(),
      }),
  });

export const getClusterDetailQueryOption = ({
  clusterId,
}: {
  clusterId: string;
}) =>
  queryOptions({
    queryKey: ['getClusterDetailApi', clusterId],
    queryFn: () => getClusterDetailApi({ clusterId }),
  });
