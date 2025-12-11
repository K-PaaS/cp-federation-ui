import { ResourceKindLowercase } from '@/models/commonModels';
import { KIND_OPTIONS } from '../components/ClusterList/ClusterSyncButton';

export interface Sync {
  name: string;
  isDuplicated: boolean;
}

export interface SyncResourceListByKind {
  kind: ResourceKindLowercase;
  list: string[];
}

export interface SyncResourceListByNamespace {
  namespace: string;
  list: SyncResourceListByKind[];
}
export interface SyncPostBody {
  createNamespace: string[];
  data: SyncResourceListByNamespace[];
}

export type ClusterStatus = 'ready' | 'not ready' | 'unknown';
export type KindOption = (typeof KIND_OPTIONS)[number];

export interface ClusterSyncButtonProps {
  clusterStatus: ClusterStatus;
  clusterId: string;
  clusterName: string;
}

export interface ClusterResourceSyncDrawerProps {
  clusterId: string;
  clusterName: string;
  onClose: () => void;
}

export interface TreeNode {
  id: string;
  name: string;
  kind: string;
  namespace?: string;
  isDuplicated?: boolean;
  isPlaceholder?: boolean;
  children?: TreeNode[];
}

export interface ResourceTreeMap {
  [namespace: string]: {
    [kind: string]: { name: string; isDuplicated: boolean }[];
  };
}

export interface CheckedResources {
  [namespace: string]: {
    [kind: string]: string[];
  };
}
