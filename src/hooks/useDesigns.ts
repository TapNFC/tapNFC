import type { Design, UpdateDesignInput } from '@/types/design';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { designService } from '@/services/designService';

type UseDesignsProps = {
  category?: string;
  searchQuery?: string;
  tag?: string;
};

export function useDesigns({
  category: initialCategory = 'all',
  searchQuery,
  tag,
}: UseDesignsProps) {
  const [category, setCategory] = useState(initialCategory);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch designs using React Query
  const {
    data: designs = [],
    isLoading: loading,
    error: queryError,
    refetch: refetchDesigns,
  } = useQuery({
    queryKey: ['designs', category, searchQuery, tag],
    queryFn: async (): Promise<Design[]> => {
      let fetchedDesigns: Design[] = [];

      if (tag) {
        fetchedDesigns = await designService.getDesignsByTag(tag);
      } else if (searchQuery) {
        fetchedDesigns = await designService.searchDesigns(searchQuery);
      } else {
        switch (category) {
          case 'templates':
            fetchedDesigns = await designService.getPublicDesigns();
            break;
          case 'my-designs': {
            let userDesigns = await designService.getUserDesigns();
            userDesigns = userDesigns.filter(design => !design.is_template);
            fetchedDesigns = userDesigns;
            break;
          }
          case 'recent': {
            let userDesigns = await designService.getUserDesigns();
            userDesigns = userDesigns
              .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
              .slice(0, 10);
            fetchedDesigns = userDesigns;
            break;
          }
          case 'all':
          default: {
            const [userDesigns, publicDesigns] = await Promise.all([
              designService.getUserDesigns(),
              designService.getPublicDesigns(),
            ]);
            fetchedDesigns = [...userDesigns, ...publicDesigns];
            break;
          }
        }
      }

      return fetchedDesigns;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create design mutation
  const createDesignMutation = useMutation({
    mutationFn: async (design: Partial<Design>) => {
      return await designService.createDesign(design);
    },
    onSuccess: (newDesign) => {
      if (newDesign) {
        queryClient.invalidateQueries({ queryKey: ['designs'] });
        toast({
          title: 'Design created',
          description: `"${newDesign.name}" has been created successfully.`,
        });
      }
    },
    onError: (err) => {
      console.error('Error creating design:', err);
      toast({
        title: 'Error',
        description: 'Failed to create design. Please try again.',
        variant: 'error',
      });
    },
  });

  // Update design mutation
  const updateDesignMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateDesignInput }) => {
      return await designService.updateDesign(id, updates);
    },
    onSuccess: (updatedDesign) => {
      if (updatedDesign) {
        queryClient.invalidateQueries({ queryKey: ['designs'] });
        toast({
          title: 'Design updated',
          description: `"${updatedDesign.name}" has been updated successfully.`,
        });
      }
    },
    onError: (err) => {
      console.error('Error updating design:', err);
      toast({
        title: 'Error',
        description: 'Failed to update design. Please try again.',
        variant: 'error',
      });
    },
  });

  // Delete design mutation
  const deleteDesignMutation = useMutation({
    mutationFn: async ({ id, designName }: { id: string; designName: string }) => {
      const success = await designService.deleteDesign(id);
      return { success, designName };
    },
    onSuccess: ({ success, designName }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['designs'] });
        toast({
          title: 'Design deleted',
          description: `"${designName}" has been deleted successfully.`,
        });
      }
    },
    onError: (err) => {
      console.error('Error deleting design:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete design. Please try again.',
        variant: 'error',
      });
    },
  });

  // Wrapper functions to maintain the same interface
  const createDesign = async (design: Partial<Design>): Promise<Design | null> => {
    return await createDesignMutation.mutateAsync(design);
  };

  const updateDesign = async (id: string, updates: UpdateDesignInput): Promise<Design | null> => {
    return await updateDesignMutation.mutateAsync({ id, updates });
  };

  const deleteDesign = async (id: string, designName: string): Promise<boolean> => {
    const result = await deleteDesignMutation.mutateAsync({ id, designName });
    return result.success;
  };

  // Search designs
  const searchDesigns = async (query: string): Promise<Design[]> => {
    if (!query.trim()) {
      await refetchDesigns();
      return designs;
    }

    try {
      const results = await designService.searchDesigns(query);
      return results;
    } catch (err) {
      console.error('Error searching designs:', err);
      toast({
        title: 'Error',
        description: 'Failed to search designs. Please try again.',
        variant: 'error',
      });
      return [];
    }
  };

  // Upload a preview image for a design
  const uploadPreviewImage = async (designId: string, file: File): Promise<string | null> => {
    try {
      const previewUrl = await designService.uploadPreviewImage(designId, file);
      if (previewUrl) {
        // Update the design with the new preview URL
        await updateDesign(designId, { preview_url: previewUrl });
        return previewUrl;
      }
      return null;
    } catch (err) {
      console.error('Error uploading preview image:', err);
      toast({
        title: 'Error',
        description: 'Failed to upload preview image. Please try again.',
        variant: 'error',
      });
      return null;
    }
  };

  // Change the category
  const changeCategory = (newCategory: string) => {
    setCategory(newCategory);
  };

  return {
    designs,
    loading,
    error: queryError?.message || null,
    category,
    changeCategory,
    createDesign,
    updateDesign,
    deleteDesign,
    searchDesigns,
    uploadPreviewImage,
    refreshDesigns: refetchDesigns,
  };
}
