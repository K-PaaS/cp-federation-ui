import ResourceList from '../ResourceList';
import ConfigMapDeleteButton from './ConfigMapDeleteButton';
import ConfigMapViewButton from './ConfigMapViewButton';

export default function ConfigMapList() {
  return (
    <ResourceList
      kind='configmap'
      DeleteButton={ConfigMapDeleteButton}
      ViewButton={ConfigMapViewButton}
    />
  );
}
