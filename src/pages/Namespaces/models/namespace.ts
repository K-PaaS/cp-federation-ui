export interface ListMeta {
  totalItems: number;
}

export interface Namespace {
  name: string;
  status: 'Active' | 'Terminating';
  created: string;
}

export interface Namespaces {
  listMeta: ListMeta;
  namespaces: Namespace[];
}

export interface NamespaceDetail {
  name: string;
  uid: string;
  yaml: string;
}

export interface CreateNamespaceRequest {
  name: string;
  labels?: string[];
}

export interface DeleteNamespaceResponse {
  code: number;
  message: string;
}

export interface NamespaceIdentifier {
  name: string;
}

export interface LabelInputProps {
  labels: string[];
  onAddLabel: (key: string, value: string) => void;
}
