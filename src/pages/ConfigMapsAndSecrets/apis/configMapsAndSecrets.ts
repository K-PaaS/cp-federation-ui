import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_SORT,
} from '@/constants/search';
import {
  CreateResourceRequest,
  ResourceDetail,
  ResourceIdentifier,
  ResourceListParams,
  ResourceResponse,
  Resources,
  UpdateResourceRequest,
} from '@/pages/ConfigMapsAndSecrets/models/configMapsAndSecrets';
import { httpClient } from '@/utils/httpClient';
import { buildQueryParams } from '@/utils/queryParam';
export async function getResourceListApi({
  kind,
  namespace,
  filterBy,
  page = DEFAULT_PAGE,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  sort = DEFAULT_SORT,
}: ResourceListParams) {
  const queryString = buildQueryParams({
    namespace,
    filterBy: filterBy ? `name,${filterBy}` : undefined,
    sortBy: sort,
    page,
    itemsPerPage,
  });

  const RESOURCE_API_URL = `/api/v1/resource/${kind}?${queryString}`;
  return httpClient.get<Resources>(RESOURCE_API_URL);
}

export async function getResourceDetailApi({
  kind,
  namespace,
  name,
}: ResourceIdentifier) {
  return httpClient.get<ResourceDetail>(
    `/api/v1/resource/${kind}/namespace/${namespace}/name/${name}`
  );
}

export async function createResourceApi(data: CreateResourceRequest) {
  return httpClient.post<ResourceResponse>('/api/v1/resource', data);
}

export async function updateResourceApi(data: UpdateResourceRequest) {
  return httpClient.put<ResourceResponse>('/api/v1/resource', data);
}

export async function deleteResourceApi({
  kind,
  namespace,
  name,
}: ResourceIdentifier) {
  return httpClient.delete<ResourceResponse>(
    `/api/v1/resource/${kind}/namespace/${namespace}/name/${name}`
  );
}
