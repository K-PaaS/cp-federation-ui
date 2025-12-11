import { Labels, Names } from '@/models/commonModels';
import {
  CreatePropagationPolicy,
  PropagationPolicies,
  PropagationPolicyDetail,
} from '@/pages/Policies/models/propagationPolicy';
import { httpClient } from '@/utils/httpClient';

export async function getResourceLabelListApi({
  kind,
  namespace,
}: {
  kind: string;
  namespace?: string;
}) {
  const params = new URLSearchParams();

  if (namespace) {
    params.append('namespace', namespace);
  }

  params.append('kind', kind.toLowerCase());

  return httpClient.get<Labels>(`/api/v1/resource/labels?${params.toString()}`);
}

export async function getResourceNameListApi({
  kind,
  namespace,
}: {
  kind: string;
  namespace?: string;
}) {
  const params = new URLSearchParams();

  if (namespace) {
    params.append('namespace', namespace);
  }

  params.append('kind', kind.toLowerCase());

  return httpClient.get<Names>(`/api/v1/resource/names?${params.toString()}`);
}

export async function getPropagationPolicyListApi({
  namespace,
  filterBy,
  page = 1,
  itemsPerPage = 10,
  sort = 'd,creationTimestamp',
}: {
  namespace?: string;
  filterBy?: string;
  page?: number;
  itemsPerPage?: number;
  sort?: string;
}) {
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

  params.append('page', page.toString());
  params.append('itemsPerPage', itemsPerPage.toString());

  const PROPAGATION_POLICY_API_URL = `/api/v1/propagationpolicy?${params.toString()}`;

  return httpClient.get<PropagationPolicies>(PROPAGATION_POLICY_API_URL);
}

export async function getPropagationPolicyDetailApi({
  namespace,
  name,
}: {
  namespace: string;
  name: string;
}) {
  return httpClient.get<PropagationPolicyDetail>(
    `/api/v1/propagationpolicy/namespace/${namespace}/${name}`
  );
}

export async function deletePropagationPolicyApi({
  namespace,
  name,
}: {
  namespace: string;
  name: string;
}) {
  return httpClient.delete(
    `/api/v1/propagationpolicy/namespace/${namespace}/${name}`
  );
}

export async function updatePropagationPolicyApi({
  namespace,
  name,
  data,
}: {
  namespace: string;
  name: string;
  data: string;
}) {
  return httpClient.put(
    `/api/v1/propagationpolicy/namespace/${namespace}/${name}`,
    { propagationData: data }
  );
}

export async function createPropagationPolicyApi({
  level,
  data,
}: {
  level: string;
  data: CreatePropagationPolicy;
}) {
  if (level === 'cluster') {
    delete data.metadata.namespace;
    return httpClient.post(`/api/v1/clusterpropagationpolicy`, data);
  }
  return httpClient.post(`/api/v1/propagationpolicy`, data);
}
