export interface ListMeta {
  totalItems: number;
}

export interface ClusterPropagationPolicy {
  name: string;
  uid: string;
  conflictResolution: 'Abort' | 'Overwrite';
  accessLevel: 'full' | 'readonly';
  relatedClusters: string[];
  relatedResources: string[];
}

export interface ClusterPropagationPolicies {
  listMeta: {
    totalItems: number;
  };
  clusterPropagationPolicies: ClusterPropagationPolicy[];
}

export interface ClusterPropagationPolicyDetail {
  name: string;
  uid: string;
  yaml: string;
}
