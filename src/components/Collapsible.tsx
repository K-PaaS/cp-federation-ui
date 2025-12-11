import { Collapsible as ChakraCollapsible } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type CollapsibleSubComponent =
  | typeof ChakraCollapsible.Root
  | typeof ChakraCollapsible.Trigger
  | typeof ChakraCollapsible.Content;

type CollapsibleProps<T extends CollapsibleSubComponent> = ComponentProps<T>;

export const Collapsible = {
  Root: ({ ...props }: CollapsibleProps<typeof ChakraCollapsible.Root>) => (
    <ChakraCollapsible.Root width='100%' {...props} />
  ),
  Trigger: ({
    ...props
  }: CollapsibleProps<typeof ChakraCollapsible.Trigger>) => (
    <ChakraCollapsible.Trigger boxSize='10' {...props} />
  ),
  Content: ({
    ...props
  }: CollapsibleProps<typeof ChakraCollapsible.Content>) => (
    <ChakraCollapsible.Content background='gray.100' {...props} />
  ),
};
