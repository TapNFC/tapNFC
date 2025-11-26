import type { QRCode, QRCodeStats } from '@/types/qr-code';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { designService } from '@/services/designService';
import { createClient } from '@/utils/supabase/client';

export type QRCodeWithStats = QRCode & {
  stats?: QRCodeStats;
};

// Fetch QR codes data
const fetchQRCodesData = async (locale: string): Promise<QRCodeWithStats[]> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const designs = await designService.getUserQrCodes(true);

  const transformedQRCodes: QRCode[] = designs.map((design) => {
    const baseUrl = window.location.origin;
    const previewIdentifier = design.slug || design.id;

    return {
      id: design.id,
      name: design.name,
      url: `${baseUrl}/${locale}/${previewIdentifier}`,
      scans: 0,
      type: design.is_template ? 'Template' : 'Design',
      created: new Date(design.created_at).toLocaleDateString(),
      previewImage: design.preview_url || '/assets/images/nextjs-starter-banner.png',
      qrCodeUrl: design.qr_code_url || null,
      qrCodeData: design.qr_code_data || null,
      isArchived: Boolean(design.is_archived),
      createdBy: design.user_id,
    };
  });

  // Fetch stats for all QR codes
  const statsPromises = transformedQRCodes.map(async (qrCode) => {
    try {
      const response = await fetch(`/api/qr-codes/${qrCode.id}`);
      if (response.ok) {
        const stats = await response.json();
        return { id: qrCode.id, stats };
      }
      return { id: qrCode.id, stats: null };
    } catch (error) {
      console.error(`Error fetching stats for QR code ${qrCode.id}:`, error);
      return { id: qrCode.id, stats: null };
    }
  });

  const statsResults = await Promise.all(statsPromises);
  const statsMap = new Map(statsResults.map(result => [result.id, result.stats]));

  // Combine QR codes with their stats
  return transformedQRCodes.map(qrCode => ({
    ...qrCode,
    scans: statsMap.get(qrCode.id)?.scans || 0,
    stats: statsMap.get(qrCode.id),
  }));
};

// Fetch current user
const fetchCurrentUser = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const useQRCodesQuery = (locale: string = 'en') => {
  const queryClient = useQueryClient();

  // Query for QR codes data
  const {
    data: qrCodes = [],
    isLoading,
    error,
    refetch: refetchQRCodes,
  } = useQuery({
    queryKey: ['qr-codes', locale],
    queryFn: () => fetchQRCodesData(locale),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Query for current user
  const { data: currentUser } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: fetchCurrentUser,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Mutation for updating QR code name
  const updateQRCodeNameMutation = useMutation({
    mutationFn: async ({ id, newName }: { id: string; newName: string }) => {
      const updatedDesign = await designService.updateDesign(id, { name: newName });
      if (!updatedDesign) {
        throw new Error('Failed to update design name');
      }
      return updatedDesign;
    },
    onSuccess: (updatedDesign, { id, newName }) => {
      // Update the cache with the new data
      queryClient.setQueryData(['qr-codes', locale], (oldData: QRCodeWithStats[] | undefined) => {
        if (!oldData) {
          return oldData;
        }

        return oldData.map((qrCode) => {
          if (qrCode.id === id) {
            const baseUrl = window.location.origin;
            const previewIdentifier = updatedDesign.slug || id;
            const newUrl = `${baseUrl}/${locale}/${previewIdentifier}`;

            return {
              ...qrCode,
              name: newName,
              url: newUrl,
              qrCodeUrl: qrCode.qrCodeUrl ? null : qrCode.qrCodeUrl, // Clear if exists to force regeneration
            };
          }
          return qrCode;
        });
      });

      toast.success('QR code name updated successfully');
    },
    onError: (error) => {
      console.error('Error updating QR code name:', error);
      toast.error('Failed to update QR code name');
    },
  });

  // Mutation for deleting QR code
  const deleteQRCodeMutation = useMutation({
    mutationFn: async (qrCodeId: string) => {
      await designService.deleteDesign(qrCodeId);
    },
    onSuccess: () => {
      // Invalidate and refetch QR codes
      queryClient.invalidateQueries({ queryKey: ['qr-codes', locale] });
      toast.success('QR code deleted permanently');
    },
    onError: (error) => {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code');
    },
  });

  // Mutation for duplicating a QR code (underlying design)
  const duplicateQRCodeMutation = useMutation({
    mutationFn: async (qrCodeId: string) => {
      // Fetch the original design
      const originalDesign = await designService.getDesignById(qrCodeId);
      if (!originalDesign) {
        throw new Error('Original QR code design not found');
      }

      // Create a duplicate design with cleared QR code data so the user must regenerate
      const duplicate = await designService.createDesign({
        user_id: originalDesign.user_id,
        name: `${originalDesign.name} (Copy)`,
        canvas_data: originalDesign.canvas_data,
        preview_url: originalDesign.preview_url,
        // Always create as a regular, non-template design
        is_template: false,
        // Preserve sharing state
        is_public: originalDesign.is_public,
        // Ensure QR image/data must be regenerated
        qr_code_url: null,
        qr_code_data: null,
        is_archived: false,
      });

      if (!duplicate) {
        throw new Error('Failed to duplicate QR code design');
      }

      return duplicate;
    },
    onSuccess: (duplicateDesign) => {
      // Add the new QR code to the cache
      queryClient.setQueryData(['qr-codes', locale], (oldData: QRCodeWithStats[] | undefined) => {
        if (!oldData) {
          return oldData;
        }

        const baseUrl = window.location.origin;
        const previewIdentifier = duplicateDesign.slug || duplicateDesign.id;

        const newQrCode: QRCodeWithStats = {
          id: duplicateDesign.id,
          name: duplicateDesign.name,
          url: `${baseUrl}/${locale}/${previewIdentifier}`,
          scans: 0,
          type: duplicateDesign.is_template ? 'Template' : 'Design',
          created: new Date(duplicateDesign.created_at).toLocaleDateString(),
          previewImage: duplicateDesign.preview_url || '/assets/images/nextjs-starter-banner.png',
          qrCodeUrl: duplicateDesign.qr_code_url || null,
          qrCodeData: duplicateDesign.qr_code_data || null,
          isArchived: Boolean(duplicateDesign.is_archived),
          createdBy: duplicateDesign.user_id,
          stats: undefined,
        };

        return [newQrCode, ...oldData];
      });

      toast.success('QR code duplicated. Please regenerate its QR image.');
    },
    onError: (error) => {
      console.error('Error duplicating QR code:', error);
      toast.error('Failed to duplicate QR code');
    },
  });

  // Mutation for archiving QR code
  const archiveQRCodeMutation = useMutation({
    mutationFn: async (qrCodeId: string) => {
      const updated = await designService.archiveDesign(qrCodeId);
      if (!updated) {
        throw new Error('Failed to archive');
      }
      return updated;
    },
    onSuccess: (updatedDesign) => {
      // Update the cache
      queryClient.setQueryData(['qr-codes', locale], (oldData: QRCodeWithStats[] | undefined) => {
        if (!oldData) {
          return oldData;
        }

        return oldData.map(qrCode =>
          qrCode.id === updatedDesign.id
            ? { ...qrCode, isArchived: true }
            : qrCode,
        );
      });

      toast.success('QR code archived successfully');
    },
    onError: (error) => {
      console.error('Error archiving QR code:', error);
      toast.error('Failed to archive QR code');
    },
  });

  // Mutation for restoring QR code
  const restoreQRCodeMutation = useMutation({
    mutationFn: async (qrCodeId: string) => {
      const updated = await designService.restoreDesign(qrCodeId);
      if (!updated) {
        throw new Error('Failed to restore');
      }
      return updated;
    },
    onSuccess: (updatedDesign) => {
      // Update the cache
      queryClient.setQueryData(['qr-codes', locale], (oldData: QRCodeWithStats[] | undefined) => {
        if (!oldData) {
          return oldData;
        }

        return oldData.map(qrCode =>
          qrCode.id === updatedDesign.id
            ? { ...qrCode, isArchived: false }
            : qrCode,
        );
      });

      toast.success('QR code restored successfully');
    },
    onError: (error) => {
      console.error('Error restoring QR code:', error);
      toast.error('Failed to restore QR code');
    },
  });

  // Helper function to check if current user owns the QR code
  const isOwnedByCurrentUser = (qrCode: QRCode): boolean => {
    return currentUser?.id === qrCode.createdBy;
  };

  return {
    qrCodes,
    isLoading,
    error,
    currentUser,
    isOwnedByCurrentUser,
    refetchQRCodes,
    updateQRCodeName: updateQRCodeNameMutation.mutate,
    deleteQRCode: deleteQRCodeMutation.mutate,
    duplicateQRCode: duplicateQRCodeMutation.mutateAsync,
    archiveQRCode: archiveQRCodeMutation.mutate,
    restoreQRCode: restoreQRCodeMutation.mutate,
    isUpdatingName: updateQRCodeNameMutation.isPending,
    isDeleting: deleteQRCodeMutation.isPending,
    isArchiving: archiveQRCodeMutation.isPending,
    isRestoring: restoreQRCodeMutation.isPending,
  };
};
