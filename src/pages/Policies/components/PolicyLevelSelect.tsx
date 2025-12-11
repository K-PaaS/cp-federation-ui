import { SegmentGroup } from '@/components/SegmentGroup';
import { Level } from '@/models/commonModels';
import { SegmentGroupValueChangeDetails } from '@chakra-ui/react';

export default function PolicyLevelSelect({
  value,
  onValueChange,
}: {
  value: Level;
  onValueChange: (value: Level) => void;
}) {
  const handleValueChange = (details: SegmentGroupValueChangeDetails) => {
    const value = details.value as Level;
    if (value !== null) {
      onValueChange(value);
    }
  };

  return (
    <SegmentGroup.Root
      value={value}
      variant='medium'
      onValueChange={handleValueChange}
    >
      <SegmentGroup.Indicator />
      <SegmentGroup.Items
        items={[
          { label: 'Namespace', value: 'namespace' },
          { label: 'Cluster', value: 'cluster' },
        ]}
      />
    </SegmentGroup.Root>
  );
}
