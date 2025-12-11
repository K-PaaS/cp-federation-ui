import { Namespaces } from '@/models/commonModels';
import { httpClient } from '@/utils/httpClient';

export async function getResourceNamespaceListApi({ kind }: { kind?: string }) {
  const params = new URLSearchParams();

  if (kind) {
    params.append('kind', kind.toLowerCase());
  }

  return httpClient.get<Namespaces>(
    `/api/v1/resource/namespaces?${params.toString()}`
  );
}
