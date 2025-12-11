import ResourceDeleteButton from '../ResourceDeleteButton';

export default function ConfigMapDeleteButton({
  namespace,
  name,
}: {
  namespace: string;
  name: string;
}) {
  return <ResourceDeleteButton kind='configmap' namespace={namespace} name={name} />;
}
