import ResourceList from '../ResourceList';
import SecretDeleteButton from './SecretDeleteButton';
import SecretViewButton from './SecretViewButton';

export default function SecretList() {
  return (
    <ResourceList
      kind='secret'
      DeleteButton={SecretDeleteButton}
      ViewButton={SecretViewButton}
    />
  );
}
