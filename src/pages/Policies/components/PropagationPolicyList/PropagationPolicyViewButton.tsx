import { Button } from '@/components/Button';
import { CloseButton } from '@/components/CloseButton';
import { toaster } from '@/components/Toaster';
import { updatePropagationPolicyApi } from '@/pages/Policies/apis/propagationPolicy';
import { Box, Drawer, HStack, Portal } from '@chakra-ui/react';
import {
  useIsMutating,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Suspense, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { monaco, MonacoDiffEditor } from 'react-monaco-editor';
import { getPropagationPolicyDetailQueryOption } from '../../query-options/policy';

export default function PropagationPolicyViewButton({
  namespace,
  name,
}: {
  namespace: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root
      size='lg'
      open={open}
      onOpenChange={details => setOpen(details.open)}
    >
      <Drawer.Trigger asChild>
        <Button variant='blueGhost'>View</Button>
      </Drawer.Trigger>
      {open === true ? (
        <ErrorBoundary
          fallback={
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Policy</Drawer.Title>
                  </Drawer.Header>
                  <Drawer.Body>
                    <Box p={4} color='red.500'>
                      데이터를 불러오는 중 오류가 발생했습니다.
                    </Box>
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Button
                      variant='blueOutline'
                      onClick={() => setOpen(false)}
                    >
                      닫기
                    </Button>
                  </Drawer.Footer>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton />
                  </Drawer.CloseTrigger>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          }
        >
          <Suspense>
            <PropagationPolicyYamlViwerDrawer
              namespace={namespace}
              name={name}
              onClose={() => setOpen(false)}
            />
          </Suspense>
        </ErrorBoundary>
      ) : null}
    </Drawer.Root>
  );
}

function PropagationPolicyYamlViwerDrawer({
  namespace,
  name,
  onClose,
}: {
  namespace: string;
  name: string;
  onClose: () => void;
}) {
  const [propagationPolicyData, setPropagationPolicyData] = useState('');
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);

  const queryClient = useQueryClient();

  const { data: propagationPolicyDetail } = useSuspenseQuery(
    getPropagationPolicyDetailQueryOption({ namespace, name })
  );

  useEffect(() => {
    if (propagationPolicyDetail?.yaml) {
      setPropagationPolicyData(propagationPolicyDetail.yaml);
    }
  }, [propagationPolicyDetail]);

  const handleEditPropagationPolicy = useMutation({
    mutationKey: ['handleEditPropagationPolicy', namespace, name],
    mutationFn: async () => {
      let loadingToaster;
      try {
        onClose();
        loadingToaster = toaster.create({
          type: 'loading',
          description: `Policy를 수정하고 있습니다.`,
        });
        await updatePropagationPolicyApi({
          namespace,
          name,
          data: propagationPolicyData,
        });
        toaster.remove(loadingToaster);
        toaster.success({
          description: `${name} Policy가 수정되었습니다.`,
        });
        queryClient.invalidateQueries({
          queryKey: ['getPolicyListApi'],
        });
      } catch (error: any) {
        toaster.error({
          description: `${error.response.data.message || '알 수 없는 오류'}`,
        });
      } finally {
        if (loadingToaster) {
          toaster.remove(loadingToaster);
        }
      }
    },
  });

  const editPropagationPolicyMutationCount = useIsMutating({
    mutationKey: ['handleEditPropagationPolicy', namespace, name],
  });

  const handleEditorChange = (value: string | undefined) => {
    if (value != null) {
      setPropagationPolicyData(value);
    }
  };

  const handleEditorMount = (editor: monaco.editor.IStandaloneDiffEditor) => {
    editorRef.current = editor;
  };

  return propagationPolicyDetail == null ? null : (
    <Portal>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <HStack justify='space-between' width='95%'>
              <Drawer.Title
                whiteSpace='nowrap'
                textOverflow='ellipsis'
                overflow='hidden'
                flex='1'
              >
                {propagationPolicyDetail.name}
              </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton />
              </Drawer.CloseTrigger>
            </HStack>
          </Drawer.Header>
          <Drawer.Body>
            <Box height='92%'>
              <MonacoDiffEditor
                original={propagationPolicyDetail.yaml}
                value={propagationPolicyDetail.yaml}
                onChange={handleEditorChange}
                editorDidMount={handleEditorMount}
                language='yaml'
                height='100%'
                options={{
                  scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                    handleMouseWheel: true,
                  },
                  overviewRulerLanes: 0,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  renderOverviewRuler: false,
                  renderSideBySide: false,
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
              disabled={editPropagationPolicyMutationCount > 0}
              onClick={() => handleEditPropagationPolicy.mutate()}
            >
              Edit
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Portal>
  );
}
