import { Progress as ChakraProgress, HStack } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type ProgressValue = number;
type ProgressProps = Omit<
  ComponentProps<typeof ChakraProgress.Root>,
  'children' | 'colorPalette'
> & {
  value: ProgressValue;
};

export const Progress = ({ value, ...props }: ProgressProps) => {
  return (
    <ChakraProgress.Root value={value} colorPalette='blue' size='lg' {...props}>
      <ChakraProgress.Track flex='1'>
        <ChakraProgress.Range />
      </ChakraProgress.Track>
    </ChakraProgress.Root>
  );
};
