import { toaster } from '@/components/Toaster';
import { createNamespaceApi } from '@/pages/Namespaces/apis/namespace';
import { TOAST_MESSAGES } from '@/pages/Namespaces/constants/validation';
import { CreateNamespaceRequest } from '@/pages/Namespaces/models/namespace';
import { getErrorMessage } from '@/pages/Namespaces/utils/validation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseCreateNamespaceOptions {
  onSuccess?: () => void;
  onSettled?: () => void;
}

export function useCreateNamespace(options?: UseCreateNamespaceOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNamespaceRequest) => {
      const loadingToast = toaster.create({
        type: 'loading',
        description: TOAST_MESSAGES.CREATING,
      });

      try {
        const response = await createNamespaceApi(data);

        toaster.remove(loadingToast);
        toaster.success({
          description: TOAST_MESSAGES.SUCCESS(data.name),
        });

        return response;
      } catch (error) {
        toaster.remove(loadingToast);
        toaster.error({
          description: getErrorMessage(error),
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getNamespaceListApi'] });
      options?.onSuccess?.();
    },
    onSettled: options?.onSettled,
  });
}

