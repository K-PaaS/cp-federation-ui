import { ClusterDetail, Clusters } from '@/pages/Clusters/models/clusters';
import { httpClient } from '@/utils/httpClient';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE, DEFAULT_SORT } from '@/constants/search';

export async function getClusterListApi({
  filterBy,
  page = DEFAULT_PAGE,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  sort = DEFAULT_SORT,
}: {
  filterBy?: string;
  page?: number;
  itemsPerPage?: number;
  sort?: string;
}) {
  const params = new URLSearchParams();

  if (filterBy) {
    params.append('filterBy', `name,${filterBy}`);
  }

  if (sort) {
    params.append('sortBy', sort);
  }

  params.append('page', page.toString());
  params.append('itemsPerPage', itemsPerPage.toString());

  const CLUSTER_API_URL = `/api/v1/cluster?${params.toString()}`;

  return httpClient.get<Clusters>(CLUSTER_API_URL);
}

export async function getClusterDetailApi({
  clusterId,
}: {
  clusterId: string;
}) {
  return httpClient.get<ClusterDetail>(`/api/v1/cluster/${clusterId}`);
}

export async function deleteClusterApi({ clusterId }: { clusterId: string }) {
  return httpClient.delete(`/api/v1/cluster/${clusterId}`);
}

export async function registerClustersApi(data: { clusterIds: string[] }) {
  return httpClient.post(`/api/v1/cluster`, data);
}

export async function getRegisterableClusterListApi() {
  return httpClient.get<Clusters>(`/api/v1/registrable-clusters`);
}
