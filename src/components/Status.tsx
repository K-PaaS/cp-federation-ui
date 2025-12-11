import type { ColorPalette } from '@chakra-ui/react';
import { Status as ChakraStatus } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

export type Variant = 'ready' | 'not ready' | 'unknown';

type StatusProps = ComponentProps<typeof ChakraStatus.Root> & {
  variant?: Variant;
};

const statusColor: Record<Variant, ColorPalette> = {
  ready: 'green',
  'not ready': 'red',
  unknown: 'gray',
};

export const Status = ({ variant = 'unknown', ...props }: StatusProps) => {
  const colorPalette = statusColor[variant];
  return (
    <ChakraStatus.Root
      fontWeight='500'
      color='#47494d'
      colorPalette={colorPalette}
      {...props}
    >
      <ChakraStatus.Indicator />
      {variant}
    </ChakraStatus.Root>
  );
};
