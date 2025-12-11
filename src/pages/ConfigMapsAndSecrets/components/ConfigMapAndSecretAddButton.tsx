import { Button } from '@/components/Button';
import { CloseButton } from '@/components/CloseButton';
import { toaster } from '@/components/Toaster';
import { Box, Drawer, Portal } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import yaml from 'js-yaml';
import { useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { createResourceApi } from '../apis/configMapsAndSecrets';
import { CONFIG_MAP_DEFAULT_DATA } from '../constants/configMapsAndSecret';

export default function ConfigMapAndSecretAddButton() {
  const [open, setOpen] = useState(false);
  const configMapAndSecretAddMutationCount = useIsMutating({
    mutationKey: ['createConfigMapAndSecretApi'],
  });

  return (
    <Drawer.Root
      size='lg'
      open={open}
      onOpenChange={details => setOpen(details.open)}
    >
      <Drawer.Trigger asChild>
        <Button
          variant='largeBlue'
          disabled={configMapAndSecretAddMutationCount > 0}
        >
          <FaPlus /> Add
        </Button>
      </Drawer.Trigger>
      {open === true ? (
        <ConfigMapAndSecretAddDrawer onClose={() => setOpen(false)} />
      ) : null}
    </Drawer.Root>
  );
}

function ConfigMapAndSecretAddDrawer({ onClose }: { onClose: () => void }) {
  const [configMapAndSecretData, setConfigMapAndSecretData] = useState(CONFIG_MAP_DEFAULT_DATA);
  const [isPlaceholder, setIsPlaceholder] = useState(true);
  const editorRef = useRef<any>(null);

  const queryClient = useQueryClient();

  const handleAddConfigMapAndSecret = useMutation({
    mutationKey: ['createConfigMapAndSecretApi'],
    mutationFn: async () => {
      let loadingToaster;

      try {
        if (!configMapAndSecretData.trim()) {
          toaster.error({
            description: 'YAML 내용을 입력해주세요.',
          });
          return;
        }

        try {
          yaml.load(configMapAndSecretData);
        } catch (yamlError) {
          const errorMessage =
            yamlError instanceof Error ? yamlError.message : '알 수 없는 오류';
          toaster.error({
            description: `YAML 형식이 올바르지 않습니다. ${errorMessage}`,
          });
          return;
        }

        onClose();
        loadingToaster = toaster.create({
          type: 'loading',
          description: `리소스를 추가하고 있습니다.`,
        });
        await createResourceApi({
          data: configMapAndSecretData,
        });

        toaster.remove(loadingToaster);
        toaster.success({
          description: `리소스가 추가되었습니다.`,
        });

        queryClient.invalidateQueries({
          queryKey: ['getConfigMapListApi'],
          refetchType: 'all',
        });
        queryClient.invalidateQueries({
          queryKey: ['getResourceListApi'],
          refetchType: 'all',
        });
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          toaster.error({
            description: `${error.response.data.message || '알 수 없는 오류'}`,
          });
        } else {
          toaster.error({
            description: `알 수 없는 오류`,
          });
        }
      } finally {
        if (loadingToaster) {
          toaster.remove(loadingToaster);
        }
      }
    },
  });

  const handleEditorChange = (value: string | undefined) => {
    if (value != null) {
      if (isPlaceholder) {
        setConfigMapAndSecretData('');
        setIsPlaceholder(false);
      } else {
        setConfigMapAndSecretData(value);
      }
    }
  };
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleBeforeMount = (monaco: any) => {
    monaco.languages.register({ id: 'yaml-placeholder' });
    monaco.languages.setMonarchTokensProvider('yaml-placeholder', {
      tokenizer: {
        root: [[/.*/, 'placeholder']],
      },
    });

    monaco.editor.defineTheme('placeholder-theme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'placeholder', foreground: '888888', fontStyle: 'italic' },
      ],
      colors: {},
    });
  };

  return (
    <Portal>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Add ConfigMap and Secret</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Box height='92%'>
              <Editor
                value={configMapAndSecretData || ''}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                beforeMount={handleBeforeMount}
                language={isPlaceholder ? 'yaml-placeholder' : 'yaml'}
                height='100%'
                theme={isPlaceholder ? 'placeholder-theme' : 'vs'}
                options={{
                  scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                    handleMouseWheel: true,
                  },
                  overviewRulerLanes: 0,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                }}
              />
            </Box>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.ActionTrigger asChild>
              <Button variant='blueOutline'>Cancel</Button>
            </Drawer.ActionTrigger>
            <Button
              variant='blue'
              disabled={
                isPlaceholder ||
                configMapAndSecretData === '' ||
                configMapAndSecretData === null
              }
              onClick={() => handleAddConfigMapAndSecret.mutate()}
            >
              Apply
            </Button>
          </Drawer.Footer>
          <Drawer.CloseTrigger asChild>
            <CloseButton />
          </Drawer.CloseTrigger>
        </Drawer.Content>
      </Drawer.Positioner>
    </Portal>
  );
}
