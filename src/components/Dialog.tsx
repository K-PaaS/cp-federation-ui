import { Dialog as ChakraDialog } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type Variant = 'alert' | 'resourceSetUp';

type DialogSubComponent =
  | typeof ChakraDialog.Root
  | typeof ChakraDialog.Body
  | typeof ChakraDialog.Header
  | typeof ChakraDialog.Title
  | typeof ChakraDialog.Footer
  | typeof ChakraDialog.Description;

type DialogProps<T extends DialogSubComponent> = ComponentProps<T> & {
  variant: Variant;
};

const rootStyleConfig: Record<
  Variant,
  Omit<ComponentProps<typeof ChakraDialog.Root>, 'children'>
> = {
  alert: { size: 'sm', placement: 'center' },
  resourceSetUp: {
    preventScroll: false,
    scrollBehavior: 'inside',
    placement: 'center',
  },
};

const contentStyleConfig: Record<
  Variant,
  ComponentProps<typeof ChakraDialog.Content>
> = {
  alert: {},
  resourceSetUp: {
    rounded: 'lg',
    borderWidth: '1px',
    maxWidth: '850px',
    // maxHeight: "875px",
    shadow: '1px 1px 3px rgba(0,0,0,0.3)',
    padding: '6px',
    as: 'form',
    pointerEvents: 'auto',
  },
};

const bodyStyleConfig: Record<
  Variant,
  ComponentProps<typeof ChakraDialog.Body>
> = {
  alert: { textAlign: 'center', paddingTop: '20px' },
  resourceSetUp: {},
};

export const Dialog = {
  Root: ({ variant, ...props }: DialogProps<typeof ChakraDialog.Root>) => (
    <ChakraDialog.Root {...rootStyleConfig[variant]} {...props} />
  ),
  Trigger: ({ ...props }: ComponentProps<typeof ChakraDialog.Trigger>) => (
    <ChakraDialog.Trigger asChild {...props} />
  ),
  Backdrop: ChakraDialog.Backdrop,
  Positioner: ChakraDialog.Positioner,
  Content: ({
    variant,
    ...props
  }: DialogProps<typeof ChakraDialog.Content>) => (
    <ChakraDialog.Content {...contentStyleConfig[variant]} {...props} />
  ),
  Header: ChakraDialog.Header,
  Body: ({ variant, ...props }: DialogProps<typeof ChakraDialog.Body>) => (
    <ChakraDialog.Body {...bodyStyleConfig[variant]} {...props} />
  ),
  Title: ChakraDialog.Title,
  Footer: ChakraDialog.Footer,
  ActionTrigger: ({
    ...props
  }: ComponentProps<typeof ChakraDialog.ActionTrigger>) => (
    <ChakraDialog.ActionTrigger asChild {...props} />
  ),
  CloseTrigger: ({
    ...props
  }: ComponentProps<typeof ChakraDialog.CloseTrigger>) => (
    <ChakraDialog.CloseTrigger asChild {...props} />
  ),
};
