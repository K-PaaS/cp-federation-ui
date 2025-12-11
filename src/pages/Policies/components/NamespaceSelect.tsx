import { NativeSelect } from '@chakra-ui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getResourceNamespaceListQueryOption } from '../../../query-options/common';

export default function NamespaceSelect() {
  const [value, setValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSelectValueChange = (value: string) => {
    setValue(value);
    searchParams.set('namespace', value);
    setSearchParams(searchParams);
  };

  const { data: resourceNamespaceList } = useSuspenseQuery(
    getResourceNamespaceListQueryOption()
  );

  return (
    <NativeSelect.Root size='md' width='200px'>
      <NativeSelect.Field
        name='namespaces'
        placeholder='Select Namespace'
        value={value}
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
