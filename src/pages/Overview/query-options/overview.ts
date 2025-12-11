import { queryOptions } from '@tanstack/react-query';
import { getOverviewApi } from '../apis/overview';

export const getOverviewQueryOption = () =>
  queryOptions({
    queryKey: ['getOverviewApi'],
    queryFn: () => getOverviewApi(),
  });
