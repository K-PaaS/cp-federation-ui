import { queryOptions } from '@tanstack/react-query';
import { getResourceNamespaceListApi } from '../apis/resource';

export const getResourceNamespaceListQueryOption = () =>
  queryOptions({
    queryKey: ['getResourceNamespaceListApi', 'namespaceSelect'],
    queryFn: () => getResourceNamespaceListApi({}),
  });
