import { WorkloadKindLowercase } from '@/models/commonModels';
import {
  CreateResourceRequest,
  ResourceDetail,
  ResourceResponse,
  Resources,
  UpdateResourceRequest,
} from '@/pages/Workloads/models/workload';
import { httpClient } from '@/utils/httpClient';

export async function getResourceListApi(
  {
    kind,
    namespace,
    filterBy,
    page = 1,
    itemsPerPage = 10,
    sort = 'd,creationTimestamp',
  }: {
    kind: WorkloadKindLowercase;
    namespace?: string;
    filterBy?: string;
    page?: number;
    itemsPerPage?: number;
    sort?: string;
  },
  signal: AbortSignal
) {
  const params = new URLSearchParams();

  if (namespace) {
    params.append('namespace', namespace);
  }

  if (filterBy) {
    params.append('filterBy', `name,${filterBy}`);
  }

  if (sort) {
    params.append('sortBy', sort);
  }

  if (page) {
    params.append('page', page.toString());
  }
  if (itemsPerPage) {
    params.append('itemsPerPage', itemsPerPage.toString());
  }

  const RESOURCE_API_URL = `/api/v1/resource/${kind}?${params.toString()}`;

  return httpClient.get<Resources>(RESOURCE_API_URL, {
    signal,
  });
}

export async function getResourceDetailApi({
  kind,
  namespace,
  name,
}: {
  kind: WorkloadKindLowercase;
  namespace: string;
  name: string;
}) {
  return httpClient.get<ResourceDetail>(
    `/api/v1/resource/${kind}/namespace/${namespace}/name/${name}`
  );
}

export async function createResourceApi(data: CreateResourceRequest) {
  return httpClient.post<ResourceResponse>(`/api/v1/resource`, data);
}

export async function updateResourceApi(data: UpdateResourceRequest) {
  return httpClient.put<ResourceResponse>(`/api/v1/resource`, data);
}

export async function deleteResourceApi({
  kind,
  namespace,
  name,
}: {
  kind: WorkloadKindLowercase;
  namespace: string;
  name: string;
}) {
  return httpClient.delete<ResourceResponse>(
    `/api/v1/resource/${kind}/namespace/${namespace}/name/${name}`
  );
}
