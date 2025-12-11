import { Button } from '@/components/Button';
import { CloseButton } from '@/components/CloseButton';
import { Dialog } from '@/components/Dialog';
import { toaster } from '@/components/Toaster';
import { deleteNamespaceApi } from '@/pages/Namespaces/apis/namespace';
import { Portal } from '@chakra-ui/react';
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';

export default function NamespaceDeleteButton({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const deleteNamespaceMutationCount = useIsMutating({
    mutationKey: ['handleDeleteNamespace', name],
  });

  return (
    <Dialog.Root
      variant='alert'
      open={open}
      onOpenChange={details => setOpen(details.open)}
    >
      <Dialog.Trigger>
        <Button variant='redGhost' disabled={deleteNamespaceMutationCount > 0}>
          Delete
        </Button>
      </Dialog.Trigger>
      {open === true ? (
        <DeleteNamespaceConfirmDialog
          name={name}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </Dialog.Root>
  );
}

function DeleteNamespaceConfirmDialog({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const handleDeleteNamespace = useMutation({
    mutationKey: ['handleDeleteNamespace', name],
    mutationFn: async () => {
      let loadingToaster;
      try {
        onClose();
        loadingToaster = toaster.create({
          type: 'loading',
          description: `${name}를 삭제하고 있습니다.`,
        });
        await deleteNamespaceApi({ name });
        toaster.remove(loadingToaster);
        toaster.success({
          description: `${name}가 삭제되었습니다.`,
        });
        queryClient.invalidateQueries({ queryKey: ['getNamespaceListApi'] });
      } catch (error: any) {
        toaster.error({
          description: `${error.response.data.message || '알 수 없는 오류'}`,
        });
        queryClient.invalidateQueries({ queryKey: ['getNamespaceListApi'] });
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
            {name}를 삭제하시겠습니까?
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger>
              <Button variant='redOutline'>Cancel</Button>
            </Dialog.ActionTrigger>
            <Button
              variant='red'
              onClick={() => handleDeleteNamespace.mutate()}
            >
              Delete
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
