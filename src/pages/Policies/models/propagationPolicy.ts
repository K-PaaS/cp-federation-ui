import {
  PaginationParams,
  WorkloadKindLowercase,
} from '../../../models/commonModels';

export interface ListMeta {
  totalItems: number;
}

export interface PropagationPolicy {
  namespace: string;
  name: string;
  uid: string;
  conflictResolution: 'Abort' | 'Overwrite';
  accessLevel: 'full' | 'readonly';
  relatedClusters: string[];
  relatedResources: string[];
}

export interface PropagationPolicies {
  listMeta: {
    totalItems: number;
  };
  propagationPolicies: PropagationPolicy[];
}

export interface PropagationPolicyDetail {
  namespace: string;
  name: string;
  uid: string;
  yaml: string;
}

type NonEmptyArray<T> = [T, ...T[]];

export interface Metadata {
  name: string;
  namespace?: string;
  labels?: string[];
  annotations?: string[];
  preserveResourcesOnDeletion: boolean;
}

export interface ResourceSelector {
  kind: WorkloadKindLowercase;
  namespace?: string;
  name?: string;
  labelSelectors?: string[];
}

export interface WeightPreference {
  targetClusters: NonEmptyArray<string>;
  weight: number;
}

export interface ReplicaScheduling {
  replicaSchedulingType?: 'Divided' | 'Duplicated';
  replicaDivisionPreference?: 'Aggregated' | 'Weighted';
  staticWeightList?: WeightPreference[];
}
export interface Placement {
  clusterNames: string[];
  replicaScheduling: ReplicaScheduling;
}

export interface CreatePropagationPolicy {
  metadata: Metadata;
  resourceSelectors: ResourceSelector[];
  placement: Placement;
}

export interface ResourceListParams extends PaginationParams {
  namespace?: string;
}
