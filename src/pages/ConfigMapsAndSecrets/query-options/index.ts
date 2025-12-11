import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_SORT,
} from '@/constants/search';
import { queryOptions } from '@tanstack/react-query';
import {
  getResourceDetailApi,
  getResourceListApi,
} from '../apis/configMapsAndSecrets';
import {
  ConfigMapAndSecretLowercase,
  ResourceListParams,
} from '../models/configMapsAndSecrets';

export const getResourceListQueryOptions = ({
  kind,
  namespace,
  filterBy,
  page = DEFAULT_PAGE,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  sort = DEFAULT_SORT,
}: ResourceListParams) => {
  const queryKey =
    kind === 'configmap'
      ? ['getConfigMapListApi', namespace, filterBy, page, itemsPerPage, sort]
      : [
          'getResourceListApi',
          'secret',
          namespace,
          filterBy,
          page,
          itemsPerPage,
          sort,
        ];

  return queryOptions({
    queryKey,
    queryFn: () =>
      getResourceListApi({
        kind,
        namespace,
        filterBy,
        page,
        itemsPerPage,
        sort,
      }),
  });
};

export const getResourceDetailQueryOptions = ({
  kind,
  namespace,
  name,
}: {
  kind: ConfigMapAndSecretLowercase;
  namespace: string;
  name: string;
}) =>
  queryOptions({
    queryKey: ['getResourceDetailApi', kind, namespace, name],
    queryFn: () => getResourceDetailApi({ kind, namespace, name }),
  });
