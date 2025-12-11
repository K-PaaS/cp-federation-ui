import { PaginationParams } from '@/models/commonModels';

export interface Namespaces {
  namespaces: string[];
}

export interface Names {
  names: string[];
}

export interface Labels {
  labels: string[];
}

export type ConfigMapAndSecret = 'ConfigMap' | 'Secret';

export type ConfigMapAndSecretLowercase = 'configmap' | 'secret';

export interface ListMeta {
  totalItems: number;
}

export interface Policy {
  isClusterScope: boolean;
  name: string;
}

export interface Resource {
  namespace: string;
  name: string;
  labels?: Record<string, string>;
  policy: Policy;
}

export interface Resources {
  listMeta: ListMeta;
  resources: Resource[];
}

export interface ResourceDetail {
  namespace: string;
  name: string;
  uid: string;
  yaml: string;
}

export interface CreateResourceRequest {
  data: string;
}

export interface UpdateResourceRequest {
  data: string;
}

export interface ResourceResponse {
  code: number;
  message: string;
}

export interface ResourceIdentifier {
  kind: ConfigMapAndSecretLowercase;
  namespace: string;
  name: string;
}

export interface ResourceListParams extends PaginationParams {
  kind: ConfigMapAndSecretLowercase;
  namespace?: string;
}
