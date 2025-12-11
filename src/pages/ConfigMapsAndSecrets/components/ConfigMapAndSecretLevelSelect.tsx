import { SegmentGroup } from '@/components/SegmentGroup';
import {
  ConfigMapAndSecret,
  ConfigMapAndSecretLowercase,
} from '@/pages/ConfigMapsAndSecrets/models/configMapsAndSecrets';
import { SegmentGroupValueChangeDetails } from '@chakra-ui/react';

export default function ConfigMapAndSecretLevelSelect({
  value,
  onValueChange,
}: {
  value: ConfigMapAndSecretLowercase;
  onValueChange: (value: ConfigMapAndSecretLowercase) => void;
}) {
  const handleValueChange = (details: SegmentGroupValueChangeDetails) => {
    const displayValue = details.value as string;
    if (displayValue !== null) {
      const lowercaseValue =
        displayValue.toLowerCase() as ConfigMapAndSecretLowercase;
      onValueChange(lowercaseValue);
    }
  };

  const getDisplayName = (
    lowercase: ConfigMapAndSecretLowercase
  ): ConfigMapAndSecret => {
    const mapping: Record<ConfigMapAndSecretLowercase, ConfigMapAndSecret> = {
      configmap: 'ConfigMap',
      secret: 'Secret',
    };
    return mapping[lowercase];
  };

  return (
    <SegmentGroup.Root
      value={getDisplayName(value)}
      variant='medium'
      onValueChange={handleValueChange}
    >
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={['ConfigMap', 'Secret']} />
    </SegmentGroup.Root>
  );
}
