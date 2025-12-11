import { Grid as ChakraGrid } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

export const Grid = ({ ...props }: ComponentProps<typeof ChakraGrid>) => {
  return <ChakraGrid templateColumns='repeat(2, 1fr)' gap='6' {...props} />;
};
