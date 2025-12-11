import { Card as ChakraCard } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type Variant = 'wide' | 'medium' | 'small';

type CardSubComponent =
  | typeof ChakraCard.Root
  | typeof ChakraCard.Body
  | typeof ChakraCard.Header
  | typeof ChakraCard.Title
  | typeof ChakraCard.Footer
  | typeof ChakraCard.Description;

type CardProps<T extends CardSubComponent> = Omit<
  ComponentProps<T>,
  'variant'
> & {
  variant: Variant;
} & (T extends typeof ChakraCard.Root
    ? { chakraVariant?: ComponentProps<typeof ChakraCard.Root>['variant'] }
    : {});

const rootStyleConfig: Record<
  Variant,
  ComponentProps<typeof ChakraCard.Root>
> = {
  wide: {
    color: '#47494d',
    size: 'lg',
  },
  medium: {
    variant: 'elevated',
    height: '270px',
    width: '345px',
  },
  small: {
    variant: 'outline',
    width: '350px',
    maxW: '350px',
    maxH: '200px',
    position: 'relative',
    overflow: 'auto',
  },
};

const bodyStyleConfig: Record<
  Variant,
  ComponentProps<typeof ChakraCard.Body>
> = {
  wide: {},
  medium: {},
  small: {
    gap: '1',
    overflowX: 'hidden',
  },
};

export const Card = {
  Root: ({
    variant,
    chakraVariant,
    ...props
  }: CardProps<typeof ChakraCard.Root>) => (
    <ChakraCard.Root
      {...rootStyleConfig[variant]}
      {...(chakraVariant != null ? { variant: chakraVariant } : {})}
      {...props}
    />
  ),
  Header: ChakraCard.Header,
  Title: ChakraCard.Title,
  Description: ChakraCard.Description,
  Body: ({ variant, ...props }: CardProps<typeof ChakraCard.Body>) => (
    <ChakraCard.Body {...bodyStyleConfig[variant]} {...props} />
  ),
  Footer: ChakraCard.Footer,
};
