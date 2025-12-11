import ResourceViewButton from '../ResourceViewButton';

export default function SecretViewButton({
  namespace,
  name,
}: {
  namespace: string;
  name: string;
}) {
  return <ResourceViewButton kind='secret' namespace={namespace} name={name} />;
}
