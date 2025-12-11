import { SegmentGroup as ChakraSegmentGroup } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type Variant = 'small' | 'medium' | 'large';

type SegmentSubComponent =
  | typeof ChakraSegmentGroup.Root
  | typeof ChakraSegmentGroup.Indicator
  | typeof ChakraSegmentGroup.Items
  | typeof ChakraSegmentGroup.Item
  | typeof ChakraSegmentGroup.ItemText
  | typeof ChakraSegmentGroup.ItemHiddenInput;

type SegmentProps<T extends SegmentSubComponent> = ComponentProps<T> & {
  variant?: Variant;
};

const rootStyleConfig: Record<
  Variant,
  ComponentProps<typeof ChakraSegmentGroup.Root>
> = {
  small: { size: 'sm' },
  medium: { size: 'md' },
  large: {
    size: 'md',
  },
};

export const SegmentGroup = {
  Root: ({
    variant,
    ...props
  }: SegmentProps<typeof ChakraSegmentGroup.Root>) => (
    <ChakraSegmentGroup.Root
      {...(variant != null ? rootStyleConfig[variant] : {})}
      {...props}
    />
  ),
  Indicator: ({
    ...props
  }: SegmentProps<typeof ChakraSegmentGroup.Indicator>) => (
    <ChakraSegmentGroup.Indicator
      background='white'
      borderRadius='md'
      {...props}
    />
  ),
  Items: ({ ...props }: SegmentProps<typeof ChakraSegmentGroup.Items>) => {
    const { items, ...restProps } = props;
    return <ChakraSegmentGroup.Items {...props} />;
  },
  Item: ({ ...props }: SegmentProps<typeof ChakraSegmentGroup.Item>) => {
    return <ChakraSegmentGroup.Item {...props} />;
  },
  ItemText: ({
    ...props
  }: SegmentProps<typeof ChakraSegmentGroup.ItemText>) => {
    return <ChakraSegmentGroup.ItemText {...props} />;
  },
  ItemHiddenInput: ({
    ...props
  }: SegmentProps<typeof ChakraSegmentGroup.ItemHiddenInput>) => {
    return <ChakraSegmentGroup.ItemHiddenInput {...props} />;
  },
};
