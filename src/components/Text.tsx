import { Text as ChakraText } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type Variant = 'small' | 'subTitle';

type TextProps = ComponentProps<typeof ChakraText> & {
  variant?: Variant;
};

const textStyles: Record<Variant, ComponentProps<typeof ChakraText>> = {
  small: {
    textStyle: 'sm',
  },
  subTitle: {
    textStyle: 'xs',
  },
};

export const Text = ({ variant, ...props }: TextProps) => {
  return (
    <ChakraText
      truncate
      color='#47494d'
      fontFamily='"Apple SD Gothic Neo", "Noto Sans KR", "맑은 고딕", "Font Awesome 5 Free", monospace'
      fontStyle='normal'
      fontWeight='400'
      {...(variant ? textStyles[variant] : {})}
      {...props}
    />
  );
};
