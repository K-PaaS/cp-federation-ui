import ResourceDeleteButton from '../ResourceDeleteButton';

export default function SecretDeleteButton({
  namespace,
  name,
}: {
  namespace: string;
  name: string;
}) {
  return <ResourceDeleteButton kind='secret' namespace={namespace} name={name} />;
}
