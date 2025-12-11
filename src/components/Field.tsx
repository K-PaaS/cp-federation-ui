import { Field as ChakraField } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type Variant = 'horizontal' | 'vertical';

type FieldSubComponent =
  | typeof ChakraField.Root
  | typeof ChakraField.Label
  | typeof ChakraField.RequiredIndicator
  | typeof ChakraField.HelperText
  | typeof ChakraField.ErrorText;

type FieldProps<T extends FieldSubComponent> = Omit<
  ComponentProps<T>,
  'variant'
> & {
  variant?: Variant;
};

const rootStyleConfig: Record<
  Variant,
  ComponentProps<typeof ChakraField.Root>
> = {
  horizontal: { orientation: 'horizontal' },
  vertical: {},
};

export const Field = {
  Root: ({ variant, ...props }: FieldProps<typeof ChakraField.Root>) => (
    <ChakraField.Root
      color='#47494d'
      fontWeight='300'
      fontFamily='Apple SD Gothic Neo Noto Sans KR 맑은 고딕 Font Awesome 5 Free monospace'
      fontStyle='normal'
      paddingTop='2%'
      paddingBottom='1%'
      {...(variant != null ? rootStyleConfig[variant] : {})}
      {...props}
    />
  ),
  Label: ChakraField.Label,
  RequiredIndicator: ChakraField.RequiredIndicator,
  HelperText: ChakraField.HelperText,
  ErrorText: ChakraField.ErrorText,
};
