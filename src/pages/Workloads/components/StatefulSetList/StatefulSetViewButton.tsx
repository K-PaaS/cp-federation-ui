import { Button } from '@/components/Button';
import { CloseButton } from '@/components/CloseButton';
import { toaster } from '@/components/Toaster';
import { updateResourceApi } from '@/pages/Workloads/apis/workload';
import { Box, Drawer, HStack, Portal } from '@chakra-ui/react';
import {
  useIsMutating,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Suspense, useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MonacoDiffEditor, monaco } from 'react-monaco-editor';
import { getResourceDetailQueryOption } from '../../query-options/workload';

export default function StatefulSetViewButton({
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
                    <Drawer.Title>StatefulSet</Drawer.Title>
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
            <StatefulSetYamlViwerDrawer
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

function StatefulSetYamlViwerDrawer({
  namespace,
  name,
  onClose,
}: {
  namespace: string;
  name: string;
  onClose: () => void;
}) {
  const [statefulSetData, setStatefulSetData] = useState('');
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);

  const queryClient = useQueryClient();

  const { data: statefulSetDetail } = useSuspenseQuery(
    getResourceDetailQueryOption({ kind: 'statefulset', namespace, name })
  );

  useEffect(() => {
    if (statefulSetDetail?.yaml) {
      setStatefulSetData(statefulSetDetail.yaml);
    }
  }, [statefulSetDetail]);

  const handleEditStatefulSet = useMutation({
    mutationKey: ['handleEditStatefulSet', 'statefulset', namespace, name],
    mutationFn: async () => {
      let loadingToaster;
      try {
        onClose();
        loadingToaster = toaster.create({
          type: 'loading',
          description: `StatefulSet를 수정하고 있습니다.`,
        });
        await updateResourceApi({
          data: statefulSetData,
        });
        toaster.remove(loadingToaster);
        toaster.success({
          description: `${name} StatefulSet가 수정되었습니다.`,
        });
        queryClient.invalidateQueries({
          queryKey: ['getResourceDetailApi', 'statefulset', namespace, name],
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

  const editStatefulSetMutationCount = useIsMutating({
    mutationKey: ['handleEditStatefulSet', 'statefulset', namespace, name],
  });

  const handleEditorChange = (value: string | undefined) => {
    if (value != null) {
      setStatefulSetData(value);
    }
  };
  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneDiffEditor
  ) => {
    editorRef.current = editor;
  };

  return statefulSetDetail == null ? null : (
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
                {statefulSetDetail.name}
              </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton />
              </Drawer.CloseTrigger>
            </HStack>
          </Drawer.Header>
          <Drawer.Body>
            <Box height='92%'>
              <MonacoDiffEditor
                original={statefulSetDetail.yaml}
                value={statefulSetData}
                onChange={handleEditorChange}
                editorDidMount={handleEditorDidMount}
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
              disabled={editStatefulSetMutationCount > 0}
              onClick={() => handleEditStatefulSet.mutate()}
            >
              Edit
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Portal>
  );
}
