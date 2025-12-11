import { Button } from '@/components/Button';
import { CloseButton } from '@/components/CloseButton';
import { toaster } from '@/components/Toaster';
import { updateClusterPropagationPolicyApi } from '@/pages/Policies/apis/clusterPropagationPolicy';
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
import { getClusterPropagationPolicyDetailQueryOption } from '../../query-options/policy';

export default function ClusterPropagationPolicyViewButton({
  name,
}: {
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
            <ClusterPropagationPolicyYamlViwerDrawer
              name={name}
              onClose={() => setOpen(false)}
            />
          </Suspense>
        </ErrorBoundary>
      ) : null}
    </Drawer.Root>
  );
}

function ClusterPropagationPolicyYamlViwerDrawer({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const [clusterPropagationPolicyData, setClusterPropagationPolicyData] =
    useState('');
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);

  const queryClient = useQueryClient();

  const { data: clusterPropagationPolicyDetail } = useSuspenseQuery(
    getClusterPropagationPolicyDetailQueryOption({ name })
  );

  useEffect(() => {
    if (clusterPropagationPolicyDetail?.yaml) {
      setClusterPropagationPolicyData(clusterPropagationPolicyDetail.yaml);
    }
  }, [clusterPropagationPolicyDetail]);

  const handleEditClusterPropagationPolicy = useMutation({
    mutationKey: ['handleEditClusterPropagationPolicy', name],
    mutationFn: async () => {
      let loadingToaster;
      try {
        onClose();
        loadingToaster = toaster.create({
          type: 'loading',
          description: `Policy를 수정하고 있습니다.`,
        });
        await updateClusterPropagationPolicyApi({
          name,
          data: clusterPropagationPolicyData,
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

  const editClusterPropagationPolicyMutationCount = useIsMutating({
    mutationKey: ['handleEditClusterPropagationPolicy', name],
  });

  const handleEditorChange = (value: string | undefined) => {
    if (value != null) {
      setClusterPropagationPolicyData(value);
    }
  };

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneDiffEditor
  ) => {
    editorRef.current = editor;
  };

  return clusterPropagationPolicyDetail == null ? null : (
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
                {clusterPropagationPolicyDetail.name}
              </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton />
              </Drawer.CloseTrigger>
            </HStack>
          </Drawer.Header>
          <Drawer.Body>
            <Box height='92%'>
              <MonacoDiffEditor
                original={clusterPropagationPolicyDetail.yaml}
                value={clusterPropagationPolicyData}
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
              disabled={editClusterPropagationPolicyMutationCount > 0}
              onClick={() => handleEditClusterPropagationPolicy.mutate()}
            >
              Edit
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Portal>
  );
}
