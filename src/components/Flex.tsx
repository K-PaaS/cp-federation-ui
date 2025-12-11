import { Flex as ChakraFlex } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

export const Flex = ({ ...props }: ComponentProps<typeof ChakraFlex>) => {
  return <ChakraFlex gap='2' flexWrap='wrap' {...props} />;
};
