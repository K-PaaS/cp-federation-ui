import { Sync, SyncPostBody } from '@/pages/Clusters/models/sync';
import { httpClient } from '@/utils/httpClient';

export async function getSyncListApi({
  clusterId,
  kind,
  namespace,
}: {
  clusterId: string;
  kind?: string;
  namespace?: string;
}) {
  const params = new URLSearchParams();

  if (kind) {
    params.append('kind', kind.toLowerCase());
  }

  if (namespace) {
    params.append('namespace', namespace.toLowerCase());
  }

  return httpClient.get<Sync[]>(
    `/api/v1/sync/resource/${clusterId}?${params.toString()}`
  );
}

export async function postSyncListApi({
  clusterId,
  data,
}: {
  clusterId: string;
  data: SyncPostBody;
}) {
  return httpClient.post(`/api/v1/sync/${clusterId}`, data);
}
