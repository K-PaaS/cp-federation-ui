import { Overview } from '@/pages/Overview/models/overview';
import { httpClient } from '@/utils/httpClient';

export async function getOverviewApi() {
  return httpClient.get<Overview>(`/api/v1/overview`);
}
