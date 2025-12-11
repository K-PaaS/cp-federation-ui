import { Button } from '@/components/Button';
import { CloseButton } from '@/components/CloseButton';
import { toaster } from '@/components/Toaster';
import { KIND_OPTIONS, ResourceKindLowercase } from '@/models/commonModels';
import { getSyncListApi, postSyncListApi } from '@/pages/Clusters/apis/sync';
import {
  CheckedResources,
  ClusterResourceSyncDrawerProps,
  ClusterSyncButtonProps,
  KindOption,
  ResourceTreeMap,
  SyncPostBody,
} from '@/pages/Clusters/models/sync';
import {
  Box,
  Checkbox,
  createTreeCollection,
  Drawer,
  HStack,
  Portal,
  TreeNode,
  TreeView,
} from '@chakra-ui/react';
import {
  useIsMutating,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { CheckedChangeDetails, CheckedState } from '@zag-js/checkbox';
import { Suspense, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LuSquareMinus, LuSquarePlus } from 'react-icons/lu';
import { DRAWER_SIZE, TREE_MAX_WIDTH, TREE_SIZE } from '../../constants/sync';
import { getSyncListQueryOptions } from '../../query-options/clusters';

export default function ClusterSyncButton({
  clusterStatus,
  clusterId,
  clusterName,
}: ClusterSyncButtonProps) {
  const [open, setOpen] = useState(false);

  const applySyncMutationCount = useIsMutating({
    mutationKey: ['handleApplySync', clusterId],
  });

  const isDisabled = clusterStatus !== 'ready' || applySyncMutationCount > 0;

  return (
    <Drawer.Root
      size={DRAWER_SIZE}
      open={open}
      onOpenChange={details => setOpen(details.open)}
    >
      <Drawer.Trigger asChild>
        <Button variant='blackGhost' disabled={isDisabled}>
          Sync
        </Button>
      </Drawer.Trigger>
      {open && (
        <ErrorBoundary
          fallback={
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>{clusterName}</Drawer.Title>
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
            <ClusterResourceSyncDrawer
              clusterId={clusterId}
              clusterName={clusterName}
              onClose={() => setOpen(false)}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </Drawer.Root>
  );
}

function ClusterResourceSyncDrawer({
  clusterId,
  clusterName,
  onClose,
}: ClusterResourceSyncDrawerProps) {
  const { data: syncResourceList } = useSuspenseQuery(
    getSyncListQueryOptions({ clusterId })
  );
  const syncMutation = useSyncMutation(clusterId, clusterName, onClose);

  const [checkedNamespaces, setCheckedNamespaces] = useState<string[]>([]);
  const [checkedResources, setCheckedResources] = useState<CheckedResources>(
    {}
  );
  const [resourceTreeMap, setResourceTreeMap] = useState<ResourceTreeMap>({});

  const isNamespaceDuplicated = (namespace: string) => {
    return syncResourceList?.find(ns => ns.name === namespace)?.isDuplicated;
  };

  const hasAnyCheckedResources = (
    resources: CheckedResources,
    namespace: string
  ) => {
    return Object.values(resources[namespace] || {}).some(
      list => list.length > 0
    );
  };

  const updateCheckedResource = (
    namespace: string,
    kind: string,
    name: string,
    checked: CheckedState
  ) => {
    setCheckedResources(prev => {
      const current = prev[namespace]?.[kind] || [];
      const updatedList =
        checked === true
          ? [...new Set([...current, name])]
          : current.filter(n => n !== name);

      const newCheckedResources = {
        ...prev,
        [namespace]: {
          ...(prev[namespace] || {}),
          [kind]: updatedList,
        },
      };

      if (checked === true && !isNamespaceDuplicated(namespace)) {
        setCheckedNamespaces(prev =>
          prev.includes(namespace) ? prev : [...prev, namespace]
        );
      } else if (checked === false) {
        if (!hasAnyCheckedResources(newCheckedResources, namespace)) {
          setCheckedNamespaces(prev => prev.filter(n => n !== namespace));
        }
      }

      return newCheckedResources;
    });
  };

  const handleResourceExpand = async (
    namespace: string,
    kind: ResourceKindLowercase
  ) => {
    if (resourceTreeMap[namespace]?.[kind]) return;

    const res = await getSyncListApi({
      clusterId,
      namespace,
      kind: kind.toLowerCase(),
    });
    setResourceTreeMap(prev => ({
      ...prev,
      [namespace]: {
        ...prev[namespace],
        [kind]: res,
      },
    }));
  };

  const handleCheckedNamespaceChange = (
    checked: CheckedState,
    name: string
  ) => {
    if (checked === true) {
      setCheckedNamespaces(prev => [...prev, name]);
      return;
    }

    if (hasAnyCheckedResources(checkedResources, name)) {
      return;
    }

    setCheckedNamespaces(prev => prev.filter(n => n !== name));
  };

  const treeData = useMemo(() => {
    return syncResourceList.map(namespace => ({
      id: `ns-${namespace.name}`,
      name: namespace.name,
      kind: 'namespace',
      isDuplicated: namespace.isDuplicated,
      children: KIND_OPTIONS.map(kind => ({
        id: `${namespace.name}-${kind.toLowerCase()}`,
        name: kind,
        kind,
        namespace: namespace.name,
        children: resourceTreeMap[namespace.name]?.[kind]
          ? resourceTreeMap[namespace.name][kind].map(resource => ({
              id: `${namespace.name}-${kind}-${resource.name}`,
              name: resource.name,
              kind,
              namespace: namespace.name,
              isDuplicated: resource.isDuplicated,
            }))
          : [
              {
                id: `placeholder-${namespace.name}-${kind}`,
                name: 'loading...',
                kind,
                namespace: namespace.name,
                isPlaceholder: true,
              },
            ],
      })),
    }));
  }, [syncResourceList, resourceTreeMap]);

  const collection = useMemo(() => {
    return createTreeCollection({
      rootNode: { id: 'root', name: 'ROOT', children: treeData },
      nodeToValue: node => node.id,
      nodeToString: node => node.name,
    });
  }, [treeData]);

  const getEnabledNamespaces = () => {
    const namespacesWithResources = Object.keys(checkedResources).filter(
      namespace => Object.keys(checkedResources[namespace]).length > 0
    );

    const allNamespaces = new Set([
      ...checkedNamespaces,
      ...namespacesWithResources,
    ]);

    return Array.from(allNamespaces).filter(
      namespace => !isNamespaceDuplicated(namespace)
    );
  };

  const generateSyncPostData = (): SyncPostBody => {
    const namespacesWithResources = Object.keys(checkedResources).filter(
      namespace => Object.keys(checkedResources[namespace]).length > 0
    );

    return {
      createNamespace: getEnabledNamespaces(),
      data: namespacesWithResources.map(namespace => ({
        namespace,
        list: Object.entries(checkedResources[namespace])
          .filter(([, resources]) => resources.length > 0)
          .map(([kind, resources]) => ({
            kind: kind.toLowerCase() as ResourceKindLowercase,
            list: resources,
          })),
      })),
    };
  };

  const syncPostData = generateSyncPostData();
  const isApplyDisabled =
    syncPostData.createNamespace.length < 1 && syncPostData.data.length < 1;

  const handleApply = () => {
    syncMutation.mutate(syncPostData);
  };

  const renderNode = ({
    node,
    nodeState,
  }: {
    node: TreeNode;
    nodeState: {
      expanded: boolean;
      isBranch?: boolean;
    };
  }) => {
    const { children, isPlaceholder, kind, name, isDuplicated, namespace } =
      node;

    if (kind === 'namespace') {
      return (
        <NamespaceNode
          node={node}
          nodeState={nodeState}
          checkedNamespaces={checkedNamespaces}
          onExpand={handleResourceExpand}
          onCheckedNamespaceChange={handleCheckedNamespaceChange}
        />
      );
    }

    if (KIND_OPTIONS.includes(kind as KindOption) && children) {
      return (
        <KindNode
          node={node}
          nodeState={nodeState}
          onExpand={handleResourceExpand}
        />
      );
    }

    if (KIND_OPTIONS.includes(kind as KindOption) && !children) {
      if (isPlaceholder) return null;
      if (!namespace) return null;

      const isChecked =
        checkedResources[namespace]?.[kind]?.includes(name) ?? false;

      return (
        <ResourceNode
          node={node}
          isChecked={isChecked}
          isDuplicated={isDuplicated ?? false}
          onCheckedChange={(detail: CheckedChangeDetails) => {
            updateCheckedResource(namespace, kind, name, detail.checked);
          }}
        />
      );
    }

    return null;
  };

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
                {clusterName}
              </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton />
              </Drawer.CloseTrigger>
            </HStack>
          </Drawer.Header>
          <Drawer.Body>
            <TreeView.Root
              maxW={TREE_MAX_WIDTH}
              size={TREE_SIZE}
              collection={collection}
            >
              <TreeView.Tree>
                <TreeView.Node
                  indentGuide={<TreeView.BranchIndentGuide />}
                  render={renderNode}
                />
              </TreeView.Tree>
            </TreeView.Root>
          </Drawer.Body>
          <DrawerFooter
            onCancel={onClose}
            onApply={handleApply}
            isApplyDisabled={isApplyDisabled}
          />
        </Drawer.Content>
      </Drawer.Positioner>
    </Portal>
  );
}

function useSyncMutation(
  clusterId: string,
  clusterName: string,
  onClose: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['handleApplySync', clusterId],
    mutationFn: async (data: SyncPostBody) => {
      let loadingToaster;
      try {
        onClose();
        loadingToaster = toaster.create({
          type: 'loading',
          description: `${clusterName}와 Sync하고 있습니다.`,
        });
        const response = await postSyncListApi({
          clusterId,
          data,
        });
        toaster.remove(loadingToaster);
        toaster.success({
          description: `Sync를 완료했습니다.\n총 요청 수: ${response.totalResource}개\n성공: ${response.successResource}개\n실패: ${response.failResource}개`,
        });
        queryClient.invalidateQueries({
          queryKey: ['getClusterListApi'],
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : (error as { response?: { data?: { message?: string } } })
                ?.response?.data?.message || '알 수 없는 오류';

        toaster.error({
          type: 'error',
          description: errorMessage,
        });
      } finally {
        if (loadingToaster) {
          toaster.remove(loadingToaster);
        }
      }
    },
  });
}

function NamespaceNode({
  node,
  nodeState,
  checkedNamespaces,
  onExpand,
  onCheckedNamespaceChange,
}: {
  node: TreeNode;
  nodeState: { expanded: boolean };
  checkedNamespaces: string[];
  onExpand: (namespace: string, kind: ResourceKindLowercase) => void;
  onCheckedNamespaceChange: (checked: CheckedState, name: string) => void;
}) {
  const { name, isDuplicated } = node;

  return (
    <Box display='flex' alignItems='center' gap={2}>
      <TreeView.BranchControl
        onClick={() => onExpand(name, 'namespace' as ResourceKindLowercase)}
      >
        {nodeState.expanded ? <LuSquareMinus /> : <LuSquarePlus />}
      </TreeView.BranchControl>
      <Checkbox.Root
        checked={checkedNamespaces.includes(name)}
        disabled={isDuplicated}
        onCheckedChange={detail =>
          onCheckedNamespaceChange(detail.checked, name)
        }
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>{name}</Checkbox.Label>
      </Checkbox.Root>
    </Box>
  );
}

function KindNode({
  node,
  nodeState,
  onExpand,
}: {
  node: TreeNode;
  nodeState: { isBranch?: boolean; expanded: boolean };
  onExpand: (namespace: string, kind: ResourceKindLowercase) => void;
}) {
  const { kind, namespace } = node;

  if (!nodeState.isBranch) {
    return (
      <TreeView.Item>
        <TreeView.ItemText>{kind}</TreeView.ItemText>
      </TreeView.Item>
    );
  }

  return (
    <TreeView.BranchControl
      onClick={() => {
        if (namespace) {
          onExpand(namespace, kind as ResourceKindLowercase);
        }
      }}
    >
      {nodeState.expanded ? <LuSquareMinus /> : <LuSquarePlus />}
      <TreeView.BranchText>{kind}</TreeView.BranchText>
    </TreeView.BranchControl>
  );
}

function ResourceNode({
  node,
  isChecked,
  isDuplicated,
  onCheckedChange,
}: {
  node: TreeNode;
  isChecked: boolean;
  isDuplicated: boolean;
  onCheckedChange: (detail: CheckedChangeDetails) => void;
}) {
  const { name } = node;

  return (
    <Box
      as='div'
      display='flex'
      alignItems='center'
      gap='2'
      width='100%'
      cursor={!isDuplicated ? 'pointer' : 'default'}
      _hover={!isDuplicated ? { bg: 'gray.50' } : {}}
      pl='14'
      pr='2'
      py='1'
      borderRadius='md'
      fontSize='sm'
      position='relative'
    >
      <Checkbox.Root
        checked={isChecked}
        disabled={isDuplicated}
        onCheckedChange={onCheckedChange}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>{name}</Checkbox.Label>
      </Checkbox.Root>
    </Box>
  );
}

function DrawerFooter({
  onCancel,
  onApply,
  isApplyDisabled,
}: {
  onCancel: () => void;
  onApply: () => void;
  isApplyDisabled: boolean;
}) {
  return (
    <Drawer.Footer>
      <Drawer.ActionTrigger asChild>
        <Button variant='blueOutline' onClick={onCancel}>
          Cancel
        </Button>
      </Drawer.ActionTrigger>
      <Button variant='blue' disabled={isApplyDisabled} onClick={onApply}>
        Apply
      </Button>
    </Drawer.Footer>
  );
}
