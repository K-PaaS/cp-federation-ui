import { NativeSelect } from '@chakra-ui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getResourceNamespaceListQueryOption } from '../../../query-options/common';

export default function ConfigMapAndSecretNamespaceSelect() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: resourceNamespaceList } = useSuspenseQuery(
    getResourceNamespaceListQueryOption()
  );

  const currentNamespace = searchParams.get('namespace') || '';

  const handleSelectValueChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set('namespace', value);
    } else {
      newSearchParams.delete('namespace');
    }
    setSearchParams(newSearchParams);
  };

  return (
    <NativeSelect.Root size='md' width='200px'>
      <NativeSelect.Field
        name='namespaces'
        placeholder='Select Namespace'
        value={currentNamespace}
        onChange={event => handleSelectValueChange(event.target.value)}
      >
        {resourceNamespaceList.namespaces.map(namespace => (
          <option value={namespace} key={namespace}>
            {namespace}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
