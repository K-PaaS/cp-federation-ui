export interface SortType {
  newest: 'd,creationTimestamp';
  oldest: 'a,creationTimestamp';
  name: 'a,name';
  namespace: 'a,namespace';
}

export interface ClusterLebelSortType {
  newest: 'd,creationTimestamp';
  oldest: 'a,creationTimestamp';
  name: 'a,name';
}

export type Level = 'namespace' | 'cluster';

export interface Namespaces {
  namespaces: string[];
}

export interface Names {
  names: string[];
}

export interface Labels {
  labels: string[];
}

export type ResourceKindLowercase =
  | 'deployment'
  | 'statefulset'
  | 'daemonset'
  | 'cronjob'
  | 'job'
  | 'configmap'
  | 'secret'
  | 'namespace';

export type WorkloadKindLowercase =
  | 'deployment'
  | 'statefulset'
  | 'daemonset'
  | 'cronjob'
  | 'job';

export interface PaginationParams {
  page?: number;
  itemsPerPage?: number;
  sort?: string;
  filterBy?: string;
}

export const KIND_OPTIONS = [
  'Deployment',
  'StatefulSet',
  'DaemonSet',
  'CronJob',
  'Job',
] as const;
