import { Button as ChakraButton } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type ButtonVariant =
  | 'blue'
  | 'largeBlue'
  | 'blueOutline'
  | 'blueSurface'
  | 'blueGhost'
  | 'red'
  | 'redOutline'
  | 'redGhost'
  | 'smallBlue'
  | 'mediumBlue'
  | 'blackGhost';

interface ButtonProps
  extends Omit<ComponentProps<typeof ChakraButton>, 'variant'> {
  variant: ButtonVariant;
  chakraVariant?: ComponentProps<typeof ChakraButton>['variant'];
}

const BUTTON_STYLE_CONFIG: Record<
  ButtonVariant,
  ComponentProps<typeof ChakraButton>
> = {
  blue: { colorPalette: 'blue', width: '7rem' },
  largeBlue: { colorPalette: 'blue', size: 'lg', fontSize: 'xl' },
  blueOutline: { colorPalette: 'blue', width: '7rem', variant: 'outline' },
  blueSurface: { colorPalette: 'blue', width: '7rem', variant: 'surface' },
  blueGhost: { color: 'blue.600', variant: 'ghost', textStyle: 'md' },
  red: { colorPalette: 'red', width: '7rem' },
  redOutline: { colorPalette: 'red', width: '7rem', variant: 'outline' },
  redGhost: {
    color: 'red.600',
    width: '7rem',
    variant: 'ghost',
    textStyle: 'md',
  },
  smallBlue: { colorPalette: 'blue', size: '2xs', fontSize: 'lg' },
  mediumBlue: { colorPalette: 'blue', size: 'sm', fontSize: 'xl' },
  blackGhost: { color: 'black.600', variant: 'ghost', textStyle: 'md' },
};

export const Button: React.FC<ButtonProps> = ({
  variant,
  chakraVariant,
  ...props
}) => {
  const buttonConfig = BUTTON_STYLE_CONFIG[variant];
  const finalVariant = chakraVariant ?? buttonConfig.variant;

  return <ChakraButton {...buttonConfig} variant={finalVariant} {...props} />;
};
