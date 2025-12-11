import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CloseButton } from '@/components/CloseButton';
import { Dialog } from '@/components/Dialog';
import { Field } from '@/components/Field';
import { Flex } from '@/components/Flex';
import { Heading } from '@/components/Heading';
import { RadioCard } from '@/components/RadioCard';
import { SegmentGroup } from '@/components/SegmentGroup';
import { Text } from '@/components/Text';
import { Tooltip } from '@/components/Tooltip';
import { KIND_OPTIONS } from '@/models/commonModels';
import {
  Badge,
  Box,
  ButtonGroup,
  Checkbox,
  CheckboxCheckedChangeDetails,
  createListCollection,
  DialogOpenChangeDetails,
  Highlight,
  HStack,
  Input,
  NativeSelect,
  Portal,
  RadioCardValueChangeDetails,
  SegmentGroupValueChangeDetails,
  Select,
  SelectValueChangeDetails,
} from '@chakra-ui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useRef, useState } from 'react';
import {
  useController,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { FaPlus } from 'react-icons/fa';
import { FormValues } from '.';
import {
  getResourceLabelListQueryOption,
  getResourceNameListQueryOption,
  getResourceNamespaceListQueryOption,
} from '../../query-options/policy';

export default function ResourceSelectors({
  onPrev,
  onNext,
  resetData,
  open,
  onOpenChange,
}: {
  onPrev: () => void;
  onNext: () => void;
  resetData: boolean;
  open: boolean;
  onOpenChange: (details: DialogOpenChangeDetails) => void;
}) {
  const watchResourceSelectors = useWatch({ name: 'data.resourceSelectors' });

  return (
    <Flex direction='column' minHeight='100%' height='100%'>
      <Heading variant='center' marginTop='2%' marginBottom='3%'>
        Resource Selectors
        <Dialog.Root
          open={open}
          onOpenChange={onOpenChange}
          variant='resourceSetUp'
          closeOnInteractOutside={false}
          closeOnEscape={false}
          preventScroll
        >
          <Dialog.Trigger>
            {watchResourceSelectors.length < 20 ? (
              <Button type='button' variant='smallBlue' marginLeft='3%'>
                <FaPlus />
              </Button>
            ) : (
              <Text variant='small' color='red' textAlign='center' width='100%'>
                더이상 추가할 수 없습니다. 최대 20개까지 추가 가능합니다.
              </Text>
            )}
          </Dialog.Trigger>
          <ResourceSelectorCreator />
        </Dialog.Root>
      </Heading>

      <Flex
        gap='2'
        flexWrap='wrap'
        overflow='auto'
        height='400px'
        maxHeight='400px'
      >
        <ResouceSelectorViewer resetData={resetData} />
      </Flex>
      <Box marginTop='auto'>
        <StepActionButtons onPrev={onPrev} onNext={onNext} />
      </Box>
    </Flex>
  );
}

function ResouceSelectorViewer({ resetData }: { resetData: boolean }) {
  const { control, resetField } = useFormContext<FormValues>();
  const {
    fieldState: { error },
  } = useController({
    name: 'data.resourceSelectors',
    control,
    rules: {
      required: '적어도 하나 이상의 ResourceSelector를 추가하세요',
    },
  });
  const { remove } = useFieldArray({
    control,
    name: 'data.resourceSelectors',
  });

  const resourceSelectors = useWatch({
    control,
    name: 'data.resourceSelectors',
  });

  useEffect(() => {
    if (resetData) {
      resetField('data.resourceSelectors', { defaultValue: [] });
    }
  }, [resetData]);

  return (
    <>
      {resourceSelectors.map((item, index) => {
        return (
          <Card.Root key={index} variant='small' width='49%'>
            <Card.Body variant='small'>
              <CloseButton
                onClick={() => remove(index)}
                variant='inbox'
                padding='5%'
                top='0px'
                right='0px'
              />
              <Field.Root variant='horizontal'>
                <HStack>
                  <Field.Label>Kind</Field.Label>
                  <Text variant='small'>{item.kind}</Text>
                </HStack>
              </Field.Root>
              {item.namespace && (
                <Field.Root variant='horizontal'>
                  <HStack>
                    <Field.Label>Namespace</Field.Label>
                    <Text variant='small'>{item.namespace}</Text>
                  </HStack>
                </Field.Root>
              )}
              {item.name && (
                <Field.Root variant='horizontal'>
                  <HStack>
                    <Field.Label>Name</Field.Label>
                    <Text variant='small'>{item.name}</Text>
                  </HStack>
                </Field.Root>
              )}
              {Array.isArray(item.labelSelectors) === true &&
              item.labelSelectors.length > 0 ? (
                <Field.Root variant='horizontal'>
                  <HStack flexWrap='wrap'>
                    <Field.Label>LabelSelectors</Field.Label>
                    <Flex gap={1} wrap='wrap' width='290px'>
                      {item.labelSelectors.map(label => (
                        <Tooltip showArrow content={label} key={label}>
                          <Badge
                            maxW='290px'
                            overflow='hidden'
                            textOverflow='ellipsis'
                            whiteSpace='nowrap'
                            display='inline-block'
                          >
                            {label}
                          </Badge>
                        </Tooltip>
                      ))}
                    </Flex>
                  </HStack>
                </Field.Root>
              ) : null}
            </Card.Body>
          </Card.Root>
        );
      })}
      {error ? (
        <Text color='red' textAlign='center' width='100%'>
          {error.root?.message}
        </Text>
      ) : null}
    </>
  );
}

function ResourceSelectorCreator() {
  const [method, setMethod] = useState('name');
  const [checkWarningInfo, setCheckWarningInfo] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const { control, getValues, trigger } = useFormContext();
  const { append } = useFieldArray({
    control,
    name: 'data.resourceSelectors',
  });
  const [showWarningField, setShowWarningField] = useState(false);
  const [resourceSelectorData, setResourceSelectorData] = useState({
    kind: 'Deployment',
    namespace: '',
    name: '',
    labelSelectors: [] as string[],
  });

  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const isOnlyKindSelected =
      resourceSelectorData.namespace === '' &&
      resourceSelectorData.name === '' &&
      resourceSelectorData.labelSelectors.length === 0;

    const id = requestAnimationFrame(() => {
      setShowWarningField(isOnlyKindSelected);
      setCheckWarningInfo(isOnlyKindSelected ? false : true);
    });

    return () => cancelAnimationFrame(id);
  }, [
    resourceSelectorData.namespace,
    resourceSelectorData.name,
    resourceSelectorData.labelSelectors,
  ]);

  const handleResouceSelectorSave = async () => {
    const existing = getValues('data.resourceSelectors');

    const isDup = existing.some((selector: typeof resourceSelectorData) => {
      return (
        selector.kind === resourceSelectorData.kind &&
        selector.namespace === resourceSelectorData.namespace &&
        selector.name === resourceSelectorData.name &&
        JSON.stringify(selector.labelSelectors ?? []) ===
          JSON.stringify(resourceSelectorData.labelSelectors ?? [])
      );
    });

    if (isDup) {
      setIsDuplicate(true);
      return;
    }

    setIsDuplicate(false);
    append(resourceSelectorData);
    await trigger('data.resourceSelectors');
    setResourceSelectorData({
      kind: 'Deployment',
      namespace: '',
      name: '',
      labelSelectors: [],
    });
    dialogCloseRef.current?.click();
  };

  const handleResouceSelectorCancel = async () => {
    setIsDuplicate(false);
    setResourceSelectorData({
      kind: 'Deployment',
      namespace: '',
      name: '',
      labelSelectors: [],
    });
    dialogCloseRef.current?.click();
  };

  const handleMethodChange = (nextMethod: string) => {
    if (method === nextMethod) return;

    setMethod(nextMethod);
    setIsDuplicate(false);

    setResourceSelectorData(prev => ({
      ...prev,
      name: '',
      labelSelectors: [],
    }));
  };

  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content variant='resourceSetUp' margin='10px auto'>
          <Dialog.Body variant='resourceSetUp' margin='2%' minHeight='425px'>
            <KindSelectRadioField
              value={resourceSelectorData.kind}
              onChange={value => {
                setIsDuplicate(false);
                setResourceSelectorData(prev => ({
                  ...prev,
                  kind: value,
                  namespace: '',
                  name: '',
                  labelSelectors: [],
                }));
              }}
            />
            <Suspense fallback={null}>
              <NamespaceSelectField
                value={resourceSelectorData.namespace}
                onChange={value => {
                  setIsDuplicate(false);
                  setResourceSelectorData(prev => ({
                    ...prev,
                    namespace: value,
                    name: '',
                    labelSelectors: [],
                  }));
                }}
              />
            </Suspense>
            <MethodRadioField value={method} onChange={handleMethodChange} />
            {method === 'name' ? (
              <NameSelectField
                kind={resourceSelectorData.kind}
                namespace={resourceSelectorData.namespace}
                value={[resourceSelectorData.name]}
                onChange={value => {
                  setIsDuplicate(false);
                  setResourceSelectorData(prev => ({
                    ...prev,
                    name: value[0],
                    labelSelectors: [],
                  }));
                }}
              />
            ) : (
              <LabelSelectorsField
                kind={resourceSelectorData.kind}
                namespace={resourceSelectorData.namespace}
                value={resourceSelectorData.labelSelectors}
                onChange={value => {
                  setIsDuplicate(false);
                  setResourceSelectorData(prev => ({
                    ...prev,
                    labelSelectors: value,
                  }));
                }}
              />
            )}
            {showWarningField === true ? (
              <CheckWarningInfoField
                value={resourceSelectorData}
                checked={checkWarningInfo}
                onCheckedChange={val => {
                  setCheckWarningInfo(val);
                  setIsDuplicate(false);
                }}
              />
            ) : null}
            {isDuplicate && (
              <Text color='red.500' fontSize='sm' mt='2'>
                이미 존재하는 설정입니다.
              </Text>
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger>
              <Button
                variant='blueOutline'
                onClick={handleResouceSelectorCancel}
              >
                Cancel
              </Button>
            </Dialog.ActionTrigger>

            <Button
              onClick={handleResouceSelectorSave}
              variant='blue'
              disabled={!checkWarningInfo}
            >
              Save
            </Button>
          </Dialog.Footer>

          <Dialog.CloseTrigger>
            <button
              ref={dialogCloseRef}
              style={{ display: 'none' }}
              aria-hidden
            />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  );
}

function KindSelectRadioField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const handleKindValueChange = (details: SegmentGroupValueChangeDetails) => {
    if (details.value !== null) {
      onChange(details.value);
    }
  };

  return (
    <Field.Root required variant='horizontal' marginTop='3%'>
      <Field.Label>
        Kind
        <Field.RequiredIndicator />
      </Field.Label>
      <SegmentGroup.Root
        value={value}
        onValueChange={handleKindValueChange}
        variant='medium'
        width='100%'
      >
        <SegmentGroup.Indicator width='20%' />
        {KIND_OPTIONS.map(kind => (
          <SegmentGroup.Item key={kind} value={kind} width='20%'>
            <SegmentGroup.ItemHiddenInput />
            <SegmentGroup.ItemText>{kind}</SegmentGroup.ItemText>
          </SegmentGroup.Item>
        ))}
      </SegmentGroup.Root>
      {(() => {
        return null;
      })()}
    </Field.Root>
  );
}

function NamespaceSelectField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const watchLevel = useWatch({ name: 'level' });
  const watchNamespace = useWatch({ name: 'data.metadata.namespace' });
  const watchKind = useWatch({
    name: 'data.resourceSelectors.kind',
  });

  const { data: resourceNamespaceList } = useSuspenseQuery(
    getResourceNamespaceListQueryOption({ kind: watchKind })
  );

  useEffect(() => {
    if (watchLevel === 'namespace' && value !== watchNamespace) {
      onChange(watchNamespace);
    }
  }, [watchLevel, watchNamespace, value]);

  return (
    <Field.Root variant='vertical' orientation='horizontal' marginTop='3%'>
      <Field.Label>
        Namespace{' '}
        <Field.RequiredIndicator
          fallback={
            <Badge size='xs' variant='surface'>
              Optional
            </Badge>
          }
        />
      </Field.Label>
      {watchLevel === 'namespace' ? (
        <Input disabled value={watchNamespace} readOnly />
      ) : (
        <NativeSelect.Root>
          <NativeSelect.Field
            placeholder='Select Namespace'
            value={value}
            onChange={event => onChange(event.target.value)}
          >
            {resourceNamespaceList == null
              ? null
              : resourceNamespaceList.namespaces.map(namespace => (
                  <option value={namespace} key={namespace}>
                    {namespace}
                  </option>
                ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      )}
    </Field.Root>
  );
}

function MethodRadioField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const handleValueChange = (details: RadioCardValueChangeDetails) => {
    if (details.value !== null) {
      onChange(details.value);
    }
  };

  return (
    <HStack gap='4' align='center' marginTop='3%'>
      <RadioCard.Root
        size='sm'
        value={value}
        onValueChange={details => handleValueChange(details)}
      >
        <HStack gap='5'>
          <Badge size='xs' variant='surface' colorPalette='gray'>
            Optional
          </Badge>
          <RadioCard.Item key='name' value='name'>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemText>Name</RadioCard.ItemText>
              <RadioCard.ItemIndicator />
            </RadioCard.ItemControl>
          </RadioCard.Item>
          <RadioCard.Item key='labelselectors' value='labelselectors'>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemText>LabelSelectors</RadioCard.ItemText>
              <RadioCard.ItemIndicator />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        </HStack>
      </RadioCard.Root>
    </HStack>
  );
}

function NameSelectField({
  kind,
  namespace,
  value,
  onChange,
}: {
  kind: string;
  namespace: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const { data: resourceNameList } = useSuspenseQuery(
    getResourceNameListQueryOption({ kind, namespace })
  );

  const nameSelectors = createListCollection<string>({
    items: resourceNameList == null ? [] : resourceNameList.names,
  });

  const [limitExceeded, setLimitExceeded] = useState(false);

  const handleNameValueChange = (details: SelectValueChangeDetails) => {
    if (details.value !== null) {
      if (details.value.length > 2) {
        setLimitExceeded(true);
        return;
      }

      setLimitExceeded(false);
      onChange(details.value);
    }
  };

  return (
    <Field.Root variant='horizontal' marginTop='3%'>
      <Select.Root
        value={value}
        onValueChange={handleNameValueChange}
        collection={nameSelectors}
        size='md'
        positioning={{
          placement: 'bottom',
          strategy: 'fixed',
          sameWidth: true,
        }}
      >
        <Field.HelperText>
          {limitExceeded === true ? (
            <Text color='red'>리소스 이름 하나만 선택해주세요.</Text>
          ) : null}
        </Field.HelperText>
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder='Select Name' />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {nameSelectors.items.map((name, index) => (
              <Select.Item item={name} key={name + index}>
                {name}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </Field.Root>
  );
}

function LabelSelectorsField({
  kind,
  namespace,
  value,
  onChange,
}: {
  kind: string;
  namespace: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const { data: resourceLabelList } = useSuspenseQuery(
    getResourceLabelListQueryOption({ kind, namespace })
  );
  const labelSelectors = createListCollection<string>({
    items: resourceLabelList == null ? [] : resourceLabelList.labels,
  });

  const [limitExceeded, setLimitExceeded] = useState(false);

  const handleLabelValueChange = (details: SelectValueChangeDetails) => {
    if (details.value !== null) {
      if (details.value.length > 20) {
        setLimitExceeded(true);
        return;
      }

      setLimitExceeded(false);
      onChange(details.value);
    }
  };

  return (
    <Field.Root variant='horizontal' marginTop='3%'>
      <Select.Root
        multiple
        value={value}
        onValueChange={handleLabelValueChange}
        collection={labelSelectors}
        size='md'
        positioning={{
          placement: 'bottom',
          strategy: 'fixed',
          sameWidth: true,
        }}
      >
        <Field.HelperText>
          {limitExceeded === true ? (
            <Text color='red'>
              Label Selector는 최대 20개까지 선택할 수 있습니다.
            </Text>
          ) : null}
        </Field.HelperText>
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder='Select LabelSelectors' />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {labelSelectors.items.map((label, index) => (
              <Select.Item item={label} key={label + index}>
                {label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </Field.Root>
  );
}

function CheckWarningInfoField({
  value,
  checked,
  onCheckedChange,
}: {
  value: {
    kind: string;
    namespace: string;
    name: string;
    labelSelectors: string[];
  };
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const isOnlyKindSelected =
    value.namespace === '' &&
    value.name === '' &&
    value.labelSelectors.length === 0;

  useEffect(() => {
    if (isOnlyKindSelected) {
      onCheckedChange(false);
    } else {
      onCheckedChange(true);
    }
  }, [value.namespace, value.name, value.labelSelectors]);

  if (!isOnlyKindSelected) return null;

  return (
    <Flex marginTop='3%'>
      <Checkbox.Root
        colorPalette='blue'
        checked={checked}
        onCheckedChange={(value: CheckboxCheckedChangeDetails) =>
          onCheckedChange(value.checked as boolean)
        }
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>
          <Highlight
            query='해당 Kind의 모든 리소스가 전파'
            styles={{ px: '0.5', bg: 'yellow.subtle', color: 'orange.fg' }}
          >
            Kind 외 추가한 옵션이 없을 경우, 해당 Kind의 모든 리소스가 전파되는
            것을 확인했습니다.
          </Highlight>
        </Checkbox.Label>
      </Checkbox.Root>
    </Flex>
  );
}

function StepActionButtons({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <ButtonGroup width='100%' marginTop='3%'>
      <Flex justifyContent='flex-end' width='100%'>
        <Button
          onClick={() => onPrev()}
          variant='blueOutline'
          marginRight='5px'
        >
          Back
        </Button>
        <Button
          onClick={() => onNext()}
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
