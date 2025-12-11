import { Button } from '@/components/Button';
import { CloseButton } from '@/components/CloseButton';
import { Dialog } from '@/components/Dialog';
import { Field } from '@/components/Field';
import { Heading } from '@/components/Heading';
import { Input } from '@/components/Input';
import { Tooltip } from '@/components/Tooltip';
import { ERROR_MESSAGES } from '@/pages/Namespaces/constants/validation';
import {
  CreateNamespaceRequest,
  LabelInputProps,
} from '@/pages/Namespaces/models/namespace';
import { ValidationState } from '@/pages/Namespaces/models/validation';
import {
  validateLabelKey,
  validateLabelValue,
  validateNamespaceName,
} from '@/pages/Namespaces/utils/validation';
import {
  Badge,
  Collapsible,
  Fieldset,
  Flex,
  HStack,
  Portal,
  Tag,
} from '@chakra-ui/react';
import { useIsMutating } from '@tanstack/react-query';
import { MouseEvent, Suspense, useState } from 'react';
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useCreateNamespace } from '../hooks/useCreateNamespace';

type FormValues = CreateNamespaceRequest;

export function NamespaceAddButton() {
  const [open, setOpen] = useState(false);
  const mutationCount = useIsMutating({
    mutationKey: ['createNamespaceApi'],
  });

  return (
    <Dialog.Root
      variant='resourceSetUp'
      open={open}
      onOpenChange={details => setOpen(details.open)}
    >
      <Dialog.Trigger>
        <Button
          colorPalette='blue'
          variant='largeBlue'
          disabled={mutationCount > 0}
        >
          <FaPlus /> Add
        </Button>
      </Dialog.Trigger>
      {open && <NamespaceAddDialog onClose={() => setOpen(false)} />}
    </Dialog.Root>
  );
}

interface NamespaceAddDialogProps {
  onClose: () => void;
}

function NamespaceAddDialog({ onClose }: NamespaceAddDialogProps) {
  const form = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      labels: [],
    },
  });

  const {
    formState: { isValid },
  } = form;

  const createMutation = useCreateNamespace({
    onSuccess: () => {
      onClose();
    },
    onSettled: () => {
      form.reset();
    },
  });

  const handleSubmit = () => {
    const data = form.getValues();
    createMutation.mutate(data);
  };

  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content variant='resourceSetUp' margin='10px auto'>
          <Heading variant='center' marginTop='2%'>
            Add Namespace
          </Heading>
          <Dialog.Body variant='resourceSetUp' margin='2%'>
            <Suspense fallback={null}>
              <FormProvider {...form}>
                <NamespaceForm />
              </FormProvider>
            </Suspense>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger>
              <Button variant='blueOutline'>Cancel</Button>
            </Dialog.ActionTrigger>
            <Button
              variant='blue'
              disabled={!isValid}
              loading={createMutation.isPending}
              onClick={handleSubmit}
            >
              Apply
            </Button>
          </Dialog.Footer>
          <Dialog.CloseTrigger>
            <CloseButton />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
}

function NamespaceForm() {
  return (
    <Fieldset.Root>
      <Fieldset.Content>
        <Flex direction='column' gap='4'>
          <NameField />
          <LabelsField />
        </Flex>
      </Fieldset.Content>
    </Fieldset.Root>
  );
}

function NameField() {
  const { control } = useFormContext();
  const { field, fieldState } = useController({
    name: 'name',
    control,
    rules: {
      validate: value => {
        const r = validateNamespaceName(value);
        if (r === false) return true;
        if (r === 'empty') return ERROR_MESSAGES.NAME_EMPTY;
        if (r === 'invalid') return ERROR_MESSAGES.NAME_INVALID;
      },
    },
  });

  return (
    <Field.Root required invalid={!!fieldState.error}>
      <Field.Label>
        Name <Field.RequiredIndicator />
      </Field.Label>
      <Input
        value={field.value}
        onChange={e => field.onChange(e.target.value)}
      />
      {fieldState.error && (
        <Field.ErrorText>{fieldState.error.message}</Field.ErrorText>
      )}
    </Field.Root>
  );
}

function LabelsField() {
  const { control } = useFormContext();
  const { field, fieldState } = useController({
    name: 'labels',
    control,
    rules: {
      validate: labels => {
        if (!Array.isArray(labels)) return true;
        if (labels.length > 10) return ERROR_MESSAGES.LABEL_LIMIT_EXCEEDED;
        return true;
      },
    },
  });
  const [isOpen, setIsOpen] = useState(false);

  const labels: string[] = field.value || [];

  const handleAddLabel = (key: string, value: string) => {
    const updated = [
      ...labels.filter(l => !l.startsWith(`${key}=`)),
      `${key}=${value}`,
    ];
    field.onChange(updated);
  };

  const handleDeleteLabel = (labelToDelete: string) => {
    field.onChange(labels.filter(label => label !== labelToDelete));
  };

  return (
    <Field.Root variant='horizontal'>
      <Collapsible.Root
        open={isOpen}
        onOpenChange={() => setIsOpen(!isOpen)}
        width='100%'
      >
        <HStack gap='3'>
          <Field.Label>
            Labels
            <Field.RequiredIndicator
              fallback={
                <Badge size='xs' variant='surface'>
                  Optional
                </Badge>
              }
            />
          </Field.Label>
          <Collapsible.Trigger>
            {isOpen ? <FaMinus /> : <FaPlus />}
          </Collapsible.Trigger>
          <Flex gap={1} wrap='wrap' width='80%'>
            {labels.map(label => (
              <Tooltip showArrow content={label} key={label}>
                <Tag.Root maxW='300px'>
                  <Tag.Label>{label}</Tag.Label>
                  <Tag.EndElement>
                    <Tag.CloseTrigger
                      onClick={() => handleDeleteLabel(label)}
                    />
                  </Tag.EndElement>
                </Tag.Root>
              </Tooltip>
            ))}
          </Flex>
        </HStack>
        {fieldState.error && (
          <Field.ErrorText>{fieldState.error.message}</Field.ErrorText>
        )}
        <Collapsible.Content>
          <LabelInput labels={labels} onAddLabel={handleAddLabel} />
        </Collapsible.Content>
      </Collapsible.Root>
    </Field.Root>
  );
}

function LabelInput({ labels, onAddLabel }: LabelInputProps) {
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [keyValidation, setKeyValidation] = useState<ValidationState>(false);
  const [valueValidation, setValueValidation] =
    useState<ValidationState>(false);

  const handleAddClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const key = keyInput.trim();
    const value = valueInput.trim();

    const keyResult = validateLabelKey(key);
    const valueResult = validateLabelValue(value);

    setKeyValidation(keyResult);
    setValueValidation(valueResult);

    if (!keyResult && !valueResult) {
      onAddLabel(key, value);
      setKeyInput('');
      setValueInput('');
      setKeyValidation(false);
      setValueValidation(false);
    }
  };

  return (
    <Fieldset.Root>
      <Flex alignItems='flex-start'>
        <Fieldset.Content>
          <HStack gap='4'>
            <Field.Root required invalid={!!keyValidation} height='140px'>
              <Field.Label>
                Key <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={keyInput}
                onChange={event => setKeyInput(event.target.value)}
              />
              {keyValidation === 'empty' && (
                <Field.ErrorText>{ERROR_MESSAGES.KEY_EMPTY}</Field.ErrorText>
              )}
              {keyValidation === 'invalid' && (
                <Field.ErrorText>{ERROR_MESSAGES.KEY_INVALID}</Field.ErrorText>
              )}
            </Field.Root>
            <Field.Root required invalid={!!valueValidation} height='140px'>
              <Field.Label>
                Value <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={valueInput}
                onChange={event => setValueInput(event.target.value)}
              />
              {valueValidation === 'empty' && (
                <Field.ErrorText>{ERROR_MESSAGES.VALUE_EMPTY}</Field.ErrorText>
              )}
              {valueValidation === 'invalid' && (
                <Field.ErrorText>
                  {ERROR_MESSAGES.VALUE_INVALID}
                </Field.ErrorText>
              )}
            </Field.Root>
          </HStack>
        </Fieldset.Content>
        <Button
          variant='mediumBlue'
          onClick={handleAddClick}
          margin='2.5%'
          marginTop='40px'
        >
          <FaPlus />
        </Button>
      </Flex>
    </Fieldset.Root>
  );
}
