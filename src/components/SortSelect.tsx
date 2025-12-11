import {
  createListCollection,
  Portal,
  Select,
  SelectValueChangeDetails,
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';

export default function SortSelect({ level }: { level: string }) {
  const [searchParams, setSearchParams] = useSearchParams();

  let sortOptions: Record<string, string> = {
    newest: 'd,creationTimestamp',
    oldest: 'a,creationTimestamp',
    name: 'a,name',
  };

  if (level === 'namespace') {
    sortOptions = { ...sortOptions, namespace: 'a,namespace' };
  }

  const handleSelectValueChange = (details: SelectValueChangeDetails) => {
    const value = sortOptions[details.value[0]];

    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('sortBy', value);
      return next;
    });
  };

  const sortCollection = createListCollection({
    items: Object.keys(sortOptions),
  });

  return (
    <Select.Root
      collection={sortCollection}
      defaultValue={['newest']}
      onValueChange={handleSelectValueChange}
      size='sm'
      width='120px'
      marginBottom='10px'
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder='' />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {sortCollection.items.map(item => (
              <Select.Item item={item} key={item}>
                {item}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
