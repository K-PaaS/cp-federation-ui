import {
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_SORT,
} from '@/constants/search';
import {
  CreateNamespaceRequest,
  DeleteNamespaceResponse,
  NamespaceDetail,
  NamespaceIdentifier,
  Namespaces,
} from '@/pages/Namespaces/models/namespace';
import { httpClient } from '@/utils/httpClient';
import { buildQueryParams } from '@/utils/queryParam';
import { PaginationParams } from '@/models/commonModels';
const NAMESPACE_BASE_URL = '/api/v1/namespace';

export async function getNamespaceListApi({
  filterBy,
  page = DEFAULT_PAGE,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  sort = DEFAULT_SORT,
}: PaginationParams) {
  const queryString = buildQueryParams({
    filterBy: filterBy ? `name,${filterBy}` : undefined,
    sort,
    page,
    itemsPerPage,
  });

  return httpClient.get<Namespaces>(`${NAMESPACE_BASE_URL}?${queryString}`);
}

export async function getNamespaceDetailApi({ name }: NamespaceIdentifier) {
  return httpClient.get<NamespaceDetail>(`${NAMESPACE_BASE_URL}/${name}`);
}

export async function deleteNamespaceApi({ name }: NamespaceIdentifier) {
  return httpClient.delete<DeleteNamespaceResponse>(
    `${NAMESPACE_BASE_URL}/${name}`
  );
}

export async function createNamespaceApi(data: CreateNamespaceRequest) {
  return httpClient.post(NAMESPACE_BASE_URL, data);
}
