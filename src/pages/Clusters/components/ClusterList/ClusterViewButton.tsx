import { Button } from '@/components/Button';
import { CloseButton } from '@/components/CloseButton';
import { Box, Drawer, HStack, Portal } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getClusterDetailQueryOption } from '../../query-options/clusters';

export default function ClusterViewButton({
  clusterId,
}: {
  clusterId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root
      size='xl'
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
                    <Drawer.Title>Cluster</Drawer.Title>
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
            <ClusterYamlViwerDrawer clusterId={clusterId} />
          </Suspense>
        </ErrorBoundary>
      ) : null}
    </Drawer.Root>
  );
}

function ClusterYamlViwerDrawer({ clusterId }: { clusterId: string }) {
  const { data: clusterDetail } = useSuspenseQuery(
    getClusterDetailQueryOption({ clusterId })
  );

  return (
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
                {clusterDetail.name}
              </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton />
              </Drawer.CloseTrigger>
            </HStack>
          </Drawer.Header>
          <Drawer.Body>
            <Box height='92vh'>
              <Editor
                height='90vh'
                defaultLanguage='yaml'
                defaultValue={clusterDetail.yaml}
                options={{
                  readOnly: true,
                  scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden',
                    handleMouseWheel: true,
                  },
                  overviewRulerLanes: 0,
                }}
              />
            </Box>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Portal>
  );
}
