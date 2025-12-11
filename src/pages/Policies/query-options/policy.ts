import { queryOptions } from '@tanstack/react-query';
import { getResourceNamespaceListApi } from '../../../apis/resource';
import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_SORT,
} from '../../../constants/search';
import { getClusterListApi } from '../../Clusters/apis/cluster';
import {
  getClusterPropagationPolicyDetailApi,
  getClusterPropagationPolicyListApi,
} from '../apis/clusterPropagationPolicy';
import {
  getPropagationPolicyDetailApi,
  getPropagationPolicyListApi,
  getResourceLabelListApi,
  getResourceNameListApi,
} from '../apis/propagationPolicy';
import { ResourceListParams } from '../models/propagationPolicy';

export const getPropagationPolicyListQueryOption = ({
  namespace,
  filterBy,
  page = DEFAULT_PAGE,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  sort = DEFAULT_SORT,
}: ResourceListParams) =>
  queryOptions({
    queryKey: [
      'getPolicyListApi',
      'getPropagationPolicyListApi',
      namespace,
      filterBy,
      page,
      itemsPerPage,
      sort,
    ],
    queryFn: () => {
      return getPropagationPolicyListApi({
        namespace,
        filterBy,
        page,
        itemsPerPage,
        sort,
      });
    },
  });

export const getPropagationPolicyDetailQueryOption = ({
  namespace,
  name,
}: {
  namespace: string;
  name: string;
}) =>
  queryOptions({
    queryKey: ['getPropagationPolicyDetailApi', namespace, name],
    queryFn: () => getPropagationPolicyDetailApi({ namespace, name }),
  });

export const getResourceNamespaceListQueryOption = ({
  kind,
}: {
  kind: string;
}) =>
  queryOptions({
    queryKey: ['getResourceNamespaceListApi', 'resourceSelector', 'namespace'],
    queryFn: () => {
      return getResourceNamespaceListApi({
        kind,
      });
    },
  });

export const getResourceNameListQueryOption = ({
  kind,
  namespace,
}: {
  kind: string;
  namespace: string;
}) =>
  queryOptions({
    queryKey: [
      'getResourceNameListApi',
      'resourceSelector',
      'name',
      kind,
      namespace,
    ],
    queryFn: () => getResourceNameListApi({ kind, namespace }),
  });

export const getResourceLabelListQueryOption = ({
  kind,
  namespace,
}: {
  kind: string;
  namespace: string;
}) =>
  queryOptions({
    queryKey: [
      'getResourceLabelListApi',
      'resourceSelector',
      'labelSelectors',
      kind,
      namespace,
    ],
    queryFn: () => {
      return getResourceLabelListApi({
        kind,
        namespace,
      });
    },
  });

export const getClusterListQueryOption = () =>
  queryOptions({
    queryKey: [
      'getClusterListApi',
      'placement',
      'clusterAffinity',
      'clusterNames',
    ],
    queryFn: () => {
      return getClusterListApi({});
    },
  });

export const getMetadataResourceNamespaceListQueryOption = () =>
  queryOptions({
    queryKey: ['getResourceNamespaceListApi', 'metadata', 'namespace'],
    queryFn: () => {
      return getResourceNamespaceListApi({});
    },
  });

export const getClusterPropagationPolicyListQueryOption = ({
  filterBy,
  page,
  itemsPerPage,
  sort,
}: ResourceListParams) =>
  queryOptions({
    queryKey: [
      'getPolicyListApi',
      'getClusterPropagationPolicyListApi',
      filterBy,
      page,
      itemsPerPage,
      sort,
    ],
    queryFn: () => {
      return getClusterPropagationPolicyListApi({
        filterBy,
        page,
        itemsPerPage,
        sort,
      });
    },
  });

export const getClusterPropagationPolicyDetailQueryOption = ({
  name,
}: {
  name: string;
}) =>
  queryOptions({
    queryKey: ['getClusterPropagationPolicyDetailApi', name],
    queryFn: () => getClusterPropagationPolicyDetailApi({ name }),
  });
