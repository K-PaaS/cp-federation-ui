import { Tabs as ChakraTabs } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

export const Tabs = {
  Root: ({ ...props }: ComponentProps<typeof ChakraTabs.Root>) => (
    <ChakraTabs.Root size='lg' {...props} />
  ),
  List: ChakraTabs.List,
  Trigger: ChakraTabs.Trigger,
  Content: ({ ...props }: ComponentProps<typeof ChakraTabs.Content>) => (
    <ChakraTabs.Content padding='15px' {...props} />
  ),
};
