import { queryOptions } from '@tanstack/react-query';
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_SORT,
} from '../../../constants/search';
import { WorkloadKindLowercase } from '../../../models/commonModels';
import { getResourceDetailApi, getResourceListApi } from '../apis/workload';
import { ResourceListParams } from '../models/workload';

export const getResourceDetailQueryOption = ({
  kind,
  namespace,
  name,
}: {
  kind: WorkloadKindLowercase;
  namespace: string;
  name: string;
}) =>
  queryOptions({
    queryKey: ['getResourceDetailApi', kind, namespace, name],
    queryFn: () => getResourceDetailApi({ kind, namespace, name }),
  });

export const getResourceListQueryOption = ({
  kind,
  namespace,
  filterBy,
  page = DEFAULT_PAGE,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  sort = DEFAULT_SORT,
}: ResourceListParams) =>
  queryOptions({
    queryKey: [
      'getWorkloadList',
      kind,
      namespace,
      filterBy,
      page,
      itemsPerPage,
      sort,
    ],
    queryFn: ({ signal }) => {
      return getResourceListApi(
        {
          kind,
          namespace,
          filterBy,
          page,
          itemsPerPage,
          sort,
        },
        signal
      );
    },
  });
