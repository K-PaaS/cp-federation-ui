import ResourceViewButton from '../ResourceViewButton';

export default function ConfigMapViewButton({
  namespace,
  name,
}: {
  namespace: string;
  name: string;
}) {
  return <ResourceViewButton kind='configmap' namespace={namespace} name={name} />;
}
