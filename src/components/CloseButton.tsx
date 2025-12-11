import { CloseButton as ChakraCloseButton } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type Variant = 'inbox';

type CloseButtonProps = Omit<
  ComponentProps<typeof ChakraCloseButton>,
  'variant'
> & {
  variant?: Variant;
  chakraVariant?: ComponentProps<typeof ChakraCloseButton>['variant'];
};

const closeButtonStyleConfig: Record<
  Variant,
  ComponentProps<typeof ChakraCloseButton>
> = {
  inbox: {
    size: 'sm',
    position: 'absolute',
    top: '2',
    right: '2',
  },
};

export const CloseButton = ({
  variant,
  chakraVariant,
  ...props
}: CloseButtonProps) => {
  return (
    <ChakraCloseButton
      {...(variant != null ? closeButtonStyleConfig[variant] : {})}
      {...(chakraVariant != null ? { variant: chakraVariant } : {})}
      {...props}
    />
  );
};
