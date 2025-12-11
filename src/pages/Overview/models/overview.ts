export interface NodeSummary {
  totalNum: number;
  readyNum: number;
}
export interface Usage {
  cpu: number;
  memory: number;
}
export interface ClusterResourceStatus {
  propagationPolicyNum: number;
  namespaceNum: number;
  workloadNum: number;
  serviceNum: number;
  configNum: number;
}

export interface HostClusterStatus {
  name: string;
  status: string;
  nodeSummary: NodeSummary;
  realTimeUsage: Usage;
  requestUsage: Usage;
}

export interface MemberClusterStatus {
  name: string;
  status: string;
  nodeSummary: NodeSummary;
  realTimeUsage: Usage;
  requestUsage: Usage;
}

export interface Overview {
  clusterResourceStatus: ClusterResourceStatus;
  hostClusterStatus: HostClusterStatus;
  memberClusterStatus: MemberClusterStatus[];
}
