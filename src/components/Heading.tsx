import { Heading as ChakraHeading } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type Variant = 'leftSide' | 'center';

type HeadingProps = ComponentProps<typeof ChakraHeading> & {
  variant: Variant;
};

const headingStyleConfig: Record<
  Variant,
  ComponentProps<typeof ChakraHeading>
> = {
  leftSide: {},
  center: {
    textAlign: 'center',
  },
};

export const Heading = ({ variant, ...props }: HeadingProps) => {
  return (
    <ChakraHeading
      size='2xl'
      width='100%'
      color='#47494d'
      fontFamily='"Apple SD Gothic Neo", "Noto Sans KR", "맑은 고딕", "Font Awesome 5 Free", monospace'
      fontStyle='normal'
      fontWeight='400'
      {...headingStyleConfig[variant]}
      {...props}
    />
  );
};
