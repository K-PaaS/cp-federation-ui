import { CheckboxCard as ChakraCheckboxCard } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type Variant = 'large';

type CheckboxCardSubComponent =
  | typeof ChakraCheckboxCard.Root
  | typeof ChakraCheckboxCard.HiddenInput
  | typeof ChakraCheckboxCard.Control
  | typeof ChakraCheckboxCard.Content
  | typeof ChakraCheckboxCard.Label
  | typeof ChakraCheckboxCard.Indicator
  | typeof ChakraCheckboxCard.Description;

type CheckboxCardProps<T extends CheckboxCardSubComponent> = Omit<
  ComponentProps<T>,
  'variant'
> & {
  variant?: Variant;
} & (T extends typeof ChakraCheckboxCard.Root
    ? {
        chakraVariant?: ComponentProps<
          typeof ChakraCheckboxCard.Root
        >['variant'];
      }
    : {});

const rootStyleConfig: Record<
  Variant,
  ComponentProps<typeof ChakraCheckboxCard.Root>
> = {
  large: { size: 'lg' },
};

export const CheckboxCard = {
  Root: ({
    variant,
    chakraVariant,
    ...props
  }: CheckboxCardProps<typeof ChakraCheckboxCard.Root>) => (
    <ChakraCheckboxCard.Root
      colorPalette='blue'
      width='auto'
      {...(variant != null ? rootStyleConfig[variant] : {})}
      {...(chakraVariant != null ? { variant: chakraVariant } : {})}
      {...props}
    />
  ),
  HiddenInput: ChakraCheckboxCard.HiddenInput,
  Control: ChakraCheckboxCard.Control,
  Content: ChakraCheckboxCard.Content,
  Label: ChakraCheckboxCard.Label,
  Indicator: ChakraCheckboxCard.Indicator,
  Description: ChakraCheckboxCard.Description,
};
