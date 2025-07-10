import type { Design, UpdateDesignInput } from '@/types/design';
import { useCallback, useEffect, useState } from 'react';
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
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState(initialCategory);
  const { toast } = useToast();

  const fetchDesigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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

      setDesigns(fetchedDesigns);
    } catch (err) {
      setError('Failed to fetch designs');
      console.error('Error fetching designs:', err);
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery, tag]);

  // Create a new design
  const createDesign = async (design: Partial<Design>): Promise<Design | null> => {
    try {
      const newDesign = await designService.createDesign(design);
      if (newDesign) {
        setDesigns(prev => [newDesign, ...prev]);
        toast({
          title: 'Design created',
          description: `"${newDesign.name}" has been created successfully.`,
        });
        return newDesign;
      }
      return null;
    } catch (err) {
      console.error('Error creating design:', err);
      toast({
        title: 'Error',
        description: 'Failed to create design. Please try again.',
        variant: 'error',
      });
      return null;
    }
  };

  // Update an existing design
  const updateDesign = async (id: string, updates: UpdateDesignInput): Promise<Design | null> => {
    try {
      const updatedDesign = await designService.updateDesign(id, updates);
      if (updatedDesign) {
        setDesigns(prev =>
          prev.map(design => design.id === id ? updatedDesign : design),
        );
        toast({
          title: 'Design updated',
          description: `"${updatedDesign.name}" has been updated successfully.`,
        });
        return updatedDesign;
      }
      return null;
    } catch (err) {
      console.error(`Error updating design ${id}:`, err);
      toast({
        title: 'Error',
        description: 'Failed to update design. Please try again.',
        variant: 'error',
      });
      return null;
    }
  };

  // Delete a design
  const deleteDesign = async (id: string, designName: string): Promise<boolean> => {
    try {
      const success = await designService.deleteDesign(id);
      if (success) {
        setDesigns(prev => prev.filter(design => design.id !== id));
        toast({
          title: 'Design deleted',
          description: `"${designName}" has been deleted successfully.`,
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Error deleting design ${id}:`, err);
      toast({
        title: 'Error',
        description: 'Failed to delete design. Please try again.',
        variant: 'error',
      });
      return false;
    }
  };

  // Search designs - This is now handled by the main fetchDesigns effect
  // but can be kept for explicit search actions if needed elsewhere.
  const searchDesigns = async (query: string): Promise<Design[]> => {
    if (!query.trim()) {
      await fetchDesigns();
      return designs;
    }

    setLoading(true);
    try {
      const results = await designService.searchDesigns(query);
      setDesigns(results);
      return results;
    } catch (err) {
      console.error('Error searching designs:', err);
      toast({
        title: 'Error',
        description: 'Failed to search designs. Please try again.',
        variant: 'error',
      });
      return [];
    } finally {
      setLoading(false);
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

  // Change the category and fetch designs
  const changeCategory = (newCategory: string) => {
    setCategory(newCategory);
  };

  // Fetch designs on mount and when category/search/tag changes
  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  return {
    designs,
    loading,
    error,
    category,
    changeCategory,
    createDesign,
    updateDesign,
    deleteDesign,
    searchDesigns, // Keep exposing for explicit searches if needed
    uploadPreviewImage,
    refreshDesigns: fetchDesigns,
  };
}
