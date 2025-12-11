import { Button } from '@/components/Button';
import { CloseButton } from '@/components/CloseButton';
import { Box, Drawer, HStack, Portal } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getNamespaceDetailQueryOptions } from '../../query-options/namespace';

export default function NamespaceViewButton({ name }: { name: string }) {
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
                    <Drawer.Title>Namespace</Drawer.Title>
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
            <NamespaceYamlViwerDrawer name={name} />
          </Suspense>
        </ErrorBoundary>
      ) : null}
    </Drawer.Root>
  );
}

function NamespaceYamlViwerDrawer({ name }: { name: string }) {
  const { data: namespaceDetail } = useSuspenseQuery(
    getNamespaceDetailQueryOptions({ name })
  );

  return namespaceDetail == null ? null : (
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
                {namespaceDetail.name}
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
                defaultValue={namespaceDetail.yaml}
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
