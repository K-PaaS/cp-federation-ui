import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { Heading } from '@/components/Heading';
import { Input } from '@/components/Input';
import { RadioCard } from '@/components/RadioCard';
import { Tooltip } from '@/components/Tooltip';
import {
  Badge,
  Box,
  ButtonGroup,
  Collapsible,
  Fieldset,
  Flex,
  HStack,
  NativeSelect,
  RadioCardValueChangeDetails,
  Switch,
  Tag,
} from '@chakra-ui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MouseEvent, useId, useState } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { HiCheck, HiX } from 'react-icons/hi';
import { getMetadataResourceNamespaceListQueryOption } from '../../query-options/policy';

export default function Metadata({ onNext }: { onNext: () => void }) {
  const watchLevel = useWatch({ name: 'level' });

  return (
    <Flex direction='column' minHeight='100%' height='100%'>
      <Heading variant='center' marginTop='2%' marginBottom='3%'>
        Metadata
      </Heading>
      <LevelSelectRadioField />
      {watchLevel === 'namespace' ? <NamespaceSelectField /> : null}
      <NameInputField />
      <LabelCollapsibleInputField />
      <AnnotationCollapsibleInputField />
      <PrserveResourceOnDeletionField />
      <Box marginTop='auto'>
        <StepActionButtons onClick={onNext} />
      </Box>
    </Flex>
  );
}

function LevelSelectRadioField() {
  const { control, setValue } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name: 'level',
    control,
    rules: { required: 'Level을 선택하세요' },
  });

  const watchLevel: string = useWatch({ name: 'level' });

  const handleValueChange = (details: RadioCardValueChangeDetails) => {
    if (details.value !== null) {
      if (details.value === 'namespace') {
        field.onChange(details.value);
      }
      if (details.value === 'cluster') {
        field.onChange(details.value);
        setValue('data.metadata.namespace', '');
      }
    }
  };

  return (
    <Field.Root required invalid={Boolean(error)}>
      <Field.Label>
        Level
        <Field.RequiredIndicator />
      </Field.Label>
      <RadioCard.Root
        name='level'
        defaultValue={watchLevel}
        onValueChange={details => handleValueChange(details)}
      >
        <HStack gap='5'>
          <RadioCard.Item key='namespace' value='namespace'>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemText>Namespace</RadioCard.ItemText>
              <RadioCard.ItemIndicator />
            </RadioCard.ItemControl>
          </RadioCard.Item>
          <RadioCard.Item key='cluster' value='cluster'>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemText>Cluster</RadioCard.ItemText>
              <RadioCard.ItemIndicator />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        </HStack>
      </RadioCard.Root>
      {error ? <Field.ErrorText>{error.message}</Field.ErrorText> : null}
    </Field.Root>
  );
}

function NamespaceSelectField() {
  const { data: resourceNamespaceList } = useSuspenseQuery(
    getMetadataResourceNamespaceListQueryOption()
  );

  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name: 'data.metadata.namespace',
    control,
    rules: { required: 'Namespace를 선택하세요' },
  });

  return (
    <Field.Root
      required
      invalid={Boolean(error)}
      variant='vertical'
      height='90px'
    >
      <Field.Label>
        Namespace
        <Field.RequiredIndicator />
      </Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field
          name={field.name}
          value={field.value}
          onChange={e => {
            field.onChange(e);
          }}
          ref={field.ref}
          onBlur={field.onBlur}
          placeholder='Select Namespace'
        >
          {resourceNamespaceList.namespaces.map(namespace => (
            <option value={namespace} key={namespace}>
              {namespace}
            </option>
          ))}
        </NativeSelect.Field>

        <NativeSelect.Indicator />
      </NativeSelect.Root>
      {error ? <Field.ErrorText>{error.message}</Field.ErrorText> : null}
    </Field.Root>
  );
}

function NameInputField() {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name: 'data.metadata.name',
    control,
    rules: {
      required: 'Name을 입력하세요',
      validate: value => {
        const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
        if (!value) return 'Name을 입력하세요';
        if (value.length > 253) return '최대 길이는 253자입니다';
        if (!regex.test(value))
          return "영어 소문자, 숫자, '-'를 포함할 수 있고, 시작과 끝은 영어 소문자 또는 숫자여야 합니다";
        return true;
      },
    },
  });

  return (
    <Field.Root required invalid={Boolean(error)} height='117px'>
      <Field.Label>
        Name
        <Field.RequiredIndicator />
      </Field.Label>
      <Input {...field} placeholder='이름 입력' size='xl' height='40px' />
      {error ? (
        <Field.ErrorText>{error.message}</Field.ErrorText>
      ) : (
        <Field.HelperText />
      )}
    </Field.Root>
  );
}

function LabelCollapsibleInputField() {
  const { control } = useFormContext();
  const { field } = useController({
    name: 'data.metadata.labels',
    control,
  });

  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  const labels: string[] = field.value || [];

  const [isKeyValid, setIsKeyValid] = useState<false | 'empty' | 'invalid'>(
    false
  );
  const [isValueValid, setIsValueValid] = useState<false | 'empty' | 'invalid'>(
    false
  );
  const [labelLimitExceeded, setLabelLimitExceeded] = useState(false);
  const labelKeyValueRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-._]*[a-zA-Z0-9])?$/;

  const handleAddLabelClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const trimmedKey = keyInput.trim();
    const trimmedValue = valueInput.trim();

    let hasError = false;

    const isDuplicate = labels.some(label =>
      label.startsWith(`${trimmedKey}=`)
    );
    const willExceedLimit = !isDuplicate && labels.length >= 20;

    if (willExceedLimit) {
      setLabelLimitExceeded(true);
      return;
    } else {
      setLabelLimitExceeded(false);
    }

    if (!trimmedKey) {
      setIsKeyValid('empty');
      hasError = true;
    } else if (trimmedKey.length > 63 || !labelKeyValueRegex.test(trimmedKey)) {
      setIsKeyValid('invalid');
      hasError = true;
    } else {
      setIsKeyValid(false);
    }

    if (!trimmedValue) {
      setIsValueValid('empty');
      hasError = true;
    } else if (
      trimmedValue.length > 63 ||
      !labelKeyValueRegex.test(trimmedValue)
    ) {
      setIsValueValid('invalid');
      hasError = true;
    } else {
      setIsValueValid(false);
    }

    if (hasError) return;

    const updated = [
      ...labels.filter(label => !label.startsWith(`${trimmedKey}=`)),
      `${trimmedKey}=${trimmedValue}`,
    ];
    field.onChange(updated);

    setKeyInput('');
    setValueInput('');
    setIsKeyValid(false);
    setIsValueValid(false);
    setLabelLimitExceeded(false);
  };

  const handleDeleteLabelClick = (label: string) => {
    const updated = labels.filter(originLabel => originLabel !== label);
    field.onChange(updated);
    setLabelLimitExceeded(false);
  };

  return (
    <Flex padding='1.5% 0'>
      <Field.Root variant='horizontal' invalid={labelLimitExceeded}>
        <Collapsible.Root
          open={isCollapsibleOpen}
          onOpenChange={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
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
              {isCollapsibleOpen === true ? <FaMinus /> : <FaPlus />}
            </Collapsible.Trigger>
            <Flex gap={1} wrap='wrap' width='80%'>
              {labels.map(label => (
                <Tooltip showArrow content={label} key={label}>
                  <Tag.Root key={label} maxW='300px'>
                    <Tag.Label>{label}</Tag.Label>
                    <Tag.EndElement>
                      <Tag.CloseTrigger
                        onClick={() => handleDeleteLabelClick(label)}
                      />
                    </Tag.EndElement>
                  </Tag.Root>
                </Tooltip>
              ))}
            </Flex>
          </HStack>
          {labelLimitExceeded === true ? (
            <Field.ErrorText>
              Label은 최대 20개까지 추가할 수 있습니다.
            </Field.ErrorText>
          ) : (
            <HStack height='20px' />
          )}
          <Collapsible.Content>
            <Fieldset.Root>
              <Flex alignItems='center'>
                <Fieldset.Content>
                  <HStack gap='4' margin='2%'>
                    <Field.Root required invalid={!!isKeyValid} height='120px'>
                      <Field.Label>
                        Key <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        value={keyInput}
                        onChange={event => setKeyInput(event.target.value)}
                      />
                      {isKeyValid === 'empty' ? (
                        <Field.ErrorText>Key를 입력하세요</Field.ErrorText>
                      ) : isKeyValid === 'invalid' ? (
                        <Field.ErrorText>
                          1~63자의 영문자 또는 숫자로 시작하고 끝나야 하며, -,
                          ., _를 포함할 수 있습니다.
                        </Field.ErrorText>
                      ) : null}
                    </Field.Root>
                    <Field.Root
                      required
                      invalid={!!isValueValid}
                      height='120px'
                    >
                      <Field.Label>
                        Value <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        value={valueInput}
                        onChange={event => setValueInput(event.target.value)}
                      />
                      {isValueValid === 'empty' ? (
                        <Field.ErrorText>Value를 입력하세요</Field.ErrorText>
                      ) : isValueValid === 'invalid' ? (
                        <Field.ErrorText>
                          1~63자의 영문자 또는 숫자로 시작하고 끝나야 하며, -,
                          ., _를 포함할 수 있습니다.
                        </Field.ErrorText>
                      ) : null}
                    </Field.Root>
                  </HStack>
                </Fieldset.Content>
                <Button
                  variant='mediumBlue'
                  onClick={handleAddLabelClick}
                  margin='2.5%'
                  height='40px'
                >
                  <FaPlus />
                </Button>
              </Flex>
            </Fieldset.Root>
          </Collapsible.Content>
        </Collapsible.Root>
      </Field.Root>
    </Flex>
  );
}

function AnnotationCollapsibleInputField() {
  const { control } = useFormContext();
  const { field } = useController({
    name: 'data.metadata.annotations',
    control,
  });

  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  const annotations: string[] = field.value || [];

  const [isKeyValid, setIsKeyValid] = useState<false | 'empty' | 'invalid'>(
    false
  );
  const [isValueValid, setIsValueValid] = useState<false | 'empty' | 'invalid'>(
    false
  );
  const [annotationLimitExceeded, setAnnotationLimitExceeded] = useState(false);
  const annotationKeyValueRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-._]*[a-zA-Z0-9])?$/;

  const handleAnnotationClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const trimmedKey = keyInput.trim();
    const trimmedValue = valueInput.trim();

    let hasError = false;

    const isDuplicate = annotations.some(annotation =>
      annotation.startsWith(`${trimmedKey}=`)
    );
    const willExceedLimit = !isDuplicate && annotations.length >= 20;

    if (willExceedLimit) {
      setAnnotationLimitExceeded(true);
      return;
    } else {
      setAnnotationLimitExceeded(false);
    }

    if (!trimmedKey) {
      setIsKeyValid('empty');
      hasError = true;
    } else if (
      trimmedKey.length > 63 ||
      !annotationKeyValueRegex.test(trimmedKey)
    ) {
      setIsKeyValid('invalid');
      hasError = true;
    } else {
      setIsKeyValid(false);
    }

    if (!trimmedValue) {
      setIsValueValid('empty');
      hasError = true;
    } else if (!annotationKeyValueRegex.test(trimmedValue)) {
      setIsValueValid('invalid');
      hasError = true;
    } else {
      setIsValueValid(false);
    }

    if (hasError) return;

    const updated = [
      ...annotations.filter(
        annotation => !annotation.startsWith(`${trimmedKey}=`)
      ),
      `${trimmedKey}=${trimmedValue}`,
    ];
    field.onChange(updated);

    setKeyInput('');
    setValueInput('');
    setIsKeyValid(false);
    setIsValueValid(false);
    setAnnotationLimitExceeded(false);
  };

  const handleDeleteAnnotationClick = (annotation: string) => {
    const updated = annotations.filter(
      originAnnotation => originAnnotation !== annotation
    );
    field.onChange(updated);
    setAnnotationLimitExceeded(false);
  };

  return (
    <Flex padding='1.5% 0'>
      <Field.Root variant='horizontal' invalid={annotationLimitExceeded}>
        <Collapsible.Root
          open={isCollapsibleOpen}
          onOpenChange={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
          width='100%'
        >
          <HStack gap='3'>
            <Field.Label>
              Annotations
              <Field.RequiredIndicator
                fallback={
                  <Badge size='xs' variant='surface'>
                    Optional
                  </Badge>
                }
              />
            </Field.Label>
            <Collapsible.Trigger>
              {isCollapsibleOpen === true ? <FaMinus /> : <FaPlus />}
            </Collapsible.Trigger>
            <Flex gap={1} wrap='wrap' width='80%'>
              {annotations.map(annotation => (
                <Tooltip showArrow content={annotation} key={annotation}>
                  <Tag.Root key={annotation} maxW='270px'>
                    <Tag.Label>{annotation}</Tag.Label>
                    <Tag.EndElement>
                      <Tag.CloseTrigger
                        onClick={() => handleDeleteAnnotationClick(annotation)}
                      />
                    </Tag.EndElement>
                  </Tag.Root>
                </Tooltip>
              ))}
            </Flex>
          </HStack>
          {annotationLimitExceeded === true ? (
            <Field.ErrorText>
              Annotation은 최대 20개까지 추가할 수 있습니다.
            </Field.ErrorText>
          ) : (
            <HStack height='20px' />
          )}
          <Collapsible.Content>
            <Fieldset.Root>
              <Flex alignItems='end'>
                <Fieldset.Content>
                  <HStack gap='4' margin='2%'>
                    <Field.Root required invalid={!!isKeyValid} height='120px'>
                      <Field.Label>
                        Key <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        value={keyInput}
                        onChange={event => setKeyInput(event.target.value)}
                      />
                      {isKeyValid === 'empty' ? (
                        <Field.ErrorText>Key를 입력하세요</Field.ErrorText>
                      ) : isKeyValid === 'invalid' ? (
                        <Field.ErrorText>
                          1~63자의 영문자 또는 숫자로 시작하고 끝나야 하며, -,
                          ., _를 포함할 수 있습니다.
                        </Field.ErrorText>
                      ) : null}
                    </Field.Root>
                    <Field.Root
                      required
                      invalid={!!isValueValid}
                      height='120px'
                    >
                      <Field.Label>
                        Value <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        value={valueInput}
                        onChange={event => setValueInput(event.target.value)}
                      />
                      {isValueValid === 'empty' ? (
                        <Field.ErrorText>Value를 입력하세요</Field.ErrorText>
                      ) : isValueValid === 'invalid' ? (
                        <Field.ErrorText>
                          영문자 또는 숫자로 시작하고 끝나야 하며, -, ., _를
                          포함할 수 있습니다.
                        </Field.ErrorText>
                      ) : null}
                    </Field.Root>
                  </HStack>
                </Fieldset.Content>
                <Button
                  variant='mediumBlue'
                  onClick={handleAnnotationClick}
                  margin='2.5%'
                >
                  <FaPlus />
                </Button>
              </Flex>
            </Fieldset.Root>
          </Collapsible.Content>
        </Collapsible.Root>
      </Field.Root>
    </Flex>
  );
}

function PrserveResourceOnDeletionField() {
  const { control } = useFormContext();
  const { field } = useController({
    name: 'data.metadata.preserveResourcesOnDeletion',
    control,
  });
  const id = useId();
  const isChecked = field.value;

  return (
    <Tooltip
      showArrow
      ids={{ trigger: id }}
      content='리소스가 삭제될 때 멤버 클러스터에 전파되어있는 리소스들을 같이 삭제할지 선택하는 옵션'
    >
      <Switch.Root
        ids={{ root: id }}
        checked={isChecked}
        onCheckedChange={details => {
          field.onChange(details.checked);
        }}
        marginTop='3%'
        size='lg'
        colorPalette='blue'
        required
      >
        <Switch.Label fontSize='20px'>
          Preserve Resource On Deletion
        </Switch.Label>
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb>
            <Switch.ThumbIndicator fallback={<HiX color='black' />}>
              <HiCheck />
            </Switch.ThumbIndicator>
          </Switch.Thumb>
        </Switch.Control>
      </Switch.Root>
    </Tooltip>
  );
}

function StepActionButtons({ onClick }: { onClick: () => void }) {
  return (
    <ButtonGroup width='100%' marginTop='3%'>
      <Flex justifyContent='flex-end' width='100%'>
        <Button
          onClick={() => onClick()}
          variant='blueSurface'
          marginLeft='5px'
          marginRight='5px'
        >
          Next
        </Button>
      </Flex>
    </ButtonGroup>
  );
}
