import { Button } from '@/components/Button';
import { CloseButton } from '@/components/CloseButton';
import { Dialog } from '@/components/Dialog';
import { toaster } from '@/components/Toaster';
import { deleteClusterApi } from '@/pages/Clusters/apis/cluster';
import { Portal } from '@chakra-ui/react';
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';

export default function ClusterExcludeButton({
  clusterId,
  clusterName,
}: {
  clusterId: string;
  clusterName: string;
}) {
  const [open, setOpen] = useState(false);
  const excludeClusterMutationCount = useIsMutating({
    mutationKey: ['handleExcludeCluster', clusterId],
  });

  return (
    <Dialog.Root
      variant='alert'
      open={open}
      onOpenChange={details => setOpen(details.open)}
    >
      <Dialog.Trigger>
        <Button variant='redGhost' disabled={excludeClusterMutationCount > 0}>
          Exclude
        </Button>
      </Dialog.Trigger>
      {open === true ? (
        <ExcludeClusterConfirmDialog
          clusterId={clusterId}
          clusterName={clusterName}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </Dialog.Root>
  );
}

function ExcludeClusterConfirmDialog({
  clusterId,
  clusterName,
  onClose,
}: {
  clusterId: string;
  clusterName: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const handleExcludeCluster = useMutation({
    mutationKey: ['handleExcludeCluster', clusterId],
    mutationFn: async () => {
      let loadingToaster;
      try {
        onClose();
        loadingToaster = toaster.create({
          type: 'loading',
          description: `${clusterName}를 멤버 클러스터에서 제외하고 있습니다.`,
        });
        await deleteClusterApi({ clusterId });
        toaster.remove(loadingToaster);
        toaster.success({
          description: `${clusterName}가 멤버 클러스터에서 제외되었습니다.`,
        });
        queryClient.invalidateQueries({ queryKey: ['getClusterListApi'] });
      } catch (error: any) {
        toaster.error({
          description: `${error.response.data.message || '알 수 없는 오류'}`,
        });
        queryClient.invalidateQueries({ queryKey: ['getClusterListApi'] });
      } finally {
        if (loadingToaster) {
          toaster.remove(loadingToaster);
        }
      }
    },
  });

  return (
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content variant='alert'>
          <Dialog.Body variant='alert' marginTop='8%'>
            {clusterName}를 멤버 클러스터에서 제외시키겠습니까?
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger>
              <Button variant='redOutline'>Cancel</Button>
            </Dialog.ActionTrigger>
            <Button variant='red' onClick={() => handleExcludeCluster.mutate()}>
              Exclude
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
