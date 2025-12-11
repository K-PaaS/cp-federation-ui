import { RadioCard as ChakraRadioCard } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type RadioCardSubComponent =
  | typeof ChakraRadioCard.Root
  | typeof ChakraRadioCard.Label
  | typeof ChakraRadioCard.Item
  | typeof ChakraRadioCard.ItemHiddenInput
  | typeof ChakraRadioCard.ItemControl
  | typeof ChakraRadioCard.ItemContent
  | typeof ChakraRadioCard.ItemText
  | typeof ChakraRadioCard.ItemDescription
  | typeof ChakraRadioCard.ItemIndicator;

type RadioCardProps<T extends RadioCardSubComponent> = ComponentProps<T>;

export const RadioCard = {
  Root: ({ ...props }: RadioCardProps<typeof ChakraRadioCard.Root>) => (
    <ChakraRadioCard.Root width='100%' colorPalette='blue' {...props} />
  ),
  Label: ChakraRadioCard.Label,
  Item: ({ ...props }: RadioCardProps<typeof ChakraRadioCard.Item>) => (
    <ChakraRadioCard.Item width='100%' {...props} />
  ),
  ItemHiddenInput: ChakraRadioCard.ItemHiddenInput,
  ItemControl: ChakraRadioCard.ItemControl,
  ItemContent: ChakraRadioCard.ItemContent,
  ItemText: ChakraRadioCard.ItemText,
  ItemDescription: ChakraRadioCard.ItemDescription,
  ItemIndicator: ChakraRadioCard.ItemIndicator,
};
