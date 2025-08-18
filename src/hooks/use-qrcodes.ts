'use client';

import type { QRCode, QRCodeStats } from '@/types/qr-code';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { designService } from '@/services/designService';
import { createClient } from '@/utils/supabase/client';

export const useQRCodes = (locale: string = 'en') => {
  const [searchQuery, setSearchQuery] = useState('');
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [filteredQRCodes, setFilteredQRCodes] = useState<QRCode[]>([]);
  const [selectedQRCodes, setSelectedQRCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setQrCodeStats] = useState<Record<string, QRCodeStats>>({});
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedQRCodeForDownload, setSelectedQRCodeForDownload] = useState<QRCode | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQRCodeForDelete, setSelectedQRCodeForDelete] = useState<QRCode | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchQRCodes = async () => {
    try {
      setIsLoading(true);

      // Get current user ID
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      setCurrentUserId(userId || null);

      const designs = await designService.getUserQrCodes(/* includeArchived */ true);

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

      setQrCodes(transformedQRCodes);
      setFilteredQRCodes(transformedQRCodes);

      const statsPromises = transformedQRCodes.map(async (qrCode) => {
        try {
          const response = await fetch(`/api/qr-codes/${qrCode.id}`);
          if (response.ok) {
            return await response.json();
          }
          return null;
        } catch (error) {
          console.error(`Error fetching stats for QR code ${qrCode.id}:`, error);
          return null;
        }
      });

      const statsResults = await Promise.all(statsPromises);
      const statsMap: Record<string, QRCodeStats> = {};

      statsResults.forEach((stats) => {
        if (stats && stats.id) {
          statsMap[stats.id] = stats;
        }
      });

      setQrCodeStats(statsMap);

      const updatedQRCodes = transformedQRCodes.map(qrCode => ({
        ...qrCode,
        scans: statsMap[qrCode.id]?.scans || 0,
      }));

      setQrCodes(updatedQRCodes);
      setFilteredQRCodes(
        searchQuery
          ? updatedQRCodes.filter(qr =>
              qr.name.toLowerCase().includes(searchQuery.toLowerCase())
              || qr.url.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          : updatedQRCodes,
      );
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      toast.error('Failed to load QR codes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const filtered = qrCodes.filter(qr =>
        qr.name.toLowerCase().includes(searchQuery.toLowerCase())
        || qr.url.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredQRCodes(filtered);
    }
  }, [searchQuery, qrCodes, isLoading]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredQRCodes(qrCodes);
  };

  const toggleQRCodeSelection = (id: string) => {
    setSelectedQRCodes(prev =>
      prev.includes(id)
        ? prev.filter(qrId => qrId !== id)
        : [...prev, id],
    );
  };

  const isQRCodeSelected = (id: string) => {
    return selectedQRCodes.includes(id);
  };

  const updateQRCodeName = async (id: string, newName: string) => {
    try {
      const updatedDesign = await designService.updateDesign(id, { name: newName });

      if (!updatedDesign) {
        throw new Error('Failed to update design name');
      }

      // If the design has a QR code, we need to regenerate it with the new URL
      const currentQRCode = qrCodes.find(qr => qr.id === id);
      if (currentQRCode?.qrCodeUrl) {
        // Get the new URL based on the updated slug
        const baseUrl = window.location.origin;
        const previewIdentifier = updatedDesign.slug || id;
        const newUrl = `${baseUrl}/${locale}/${previewIdentifier}`;

        // Update the QR code URL in the database to reflect the new URL
        await designService.updateDesign(id, {
          qr_code_url: null, // Clear the old QR code URL to force regeneration
          qr_code_data: null,
        });

        // Update local state with new name and URL
        const updatedQRCodes = qrCodes.map(qr =>
          qr.id === id
            ? {
                ...qr,
                name: newName,
                url: newUrl,
                qrCodeUrl: null, // Clear QR code URL to indicate it needs regeneration
              }
            : qr,
        );

        setQrCodes(updatedQRCodes);
        setFilteredQRCodes(
          searchQuery
            ? updatedQRCodes.filter(qr =>
                qr.name.toLowerCase().includes(searchQuery.toLowerCase())
                || qr.url.toLowerCase().includes(searchQuery.toLowerCase()),
              )
            : updatedQRCodes,
        );

        toast.success('QR code name updated successfully. Please regenerate the QR code to reflect the new URL.');
      } else {
        // No existing QR code, just update the name and URL
        const baseUrl = window.location.origin;
        const previewIdentifier = updatedDesign.slug || id;
        const newUrl = `${baseUrl}/${locale}/${previewIdentifier}`;

        const updatedQRCodes = qrCodes.map(qr =>
          qr.id === id
            ? {
                ...qr,
                name: newName,
                url: newUrl,
              }
            : qr,
        );

        setQrCodes(updatedQRCodes);
        setFilteredQRCodes(
          searchQuery
            ? updatedQRCodes.filter(qr =>
                qr.name.toLowerCase().includes(searchQuery.toLowerCase())
                || qr.url.toLowerCase().includes(searchQuery.toLowerCase()),
              )
            : updatedQRCodes,
        );

        toast.success('QR code name updated successfully');
      }
    } catch (error) {
      console.error('Error updating QR code name:', error);
      toast.error('Failed to update QR code name');
    }
  };

  const handleDownload = (qrCode: QRCode) => {
    setSelectedQRCodeForDownload(qrCode);
    setDownloadModalOpen(true);
  };

  const closeDownloadModal = () => {
    setDownloadModalOpen(false);
    setSelectedQRCodeForDownload(null);
  };

  const handleEditQRCode = (qrCode: QRCode) => {
    window.location.href = `/${locale}/design/${qrCode.id}/qr-code`;
  };

  const handleEditDesign = (qrCode: QRCode) => {
    window.location.href = `/${locale}/design/${qrCode.id}`;
  };

  const handleDeleteQRCode = (qrCode: QRCode) => {
    setSelectedQRCodeForDelete(qrCode);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedQRCodeForDelete(null);
  };

  const archiveQRCode = async (qrCode: QRCode) => {
    try {
      const updated = await designService.archiveDesign(qrCode.id);
      if (!updated) {
        throw new Error('Failed to archive');
      }

      const updatedQRCodes = qrCodes.map(qr => (qr.id === qrCode.id ? { ...qr, isArchived: true } : qr));
      setQrCodes(updatedQRCodes);
      setFilteredQRCodes(
        searchQuery
          ? updatedQRCodes.filter(qr =>
              qr.name.toLowerCase().includes(searchQuery.toLowerCase())
              || qr.url.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          : updatedQRCodes,
      );

      // Clean selection
      if (selectedQRCodes.includes(qrCode.id)) {
        setSelectedQRCodes(prev => prev.filter(id => id !== qrCode.id));
      }

      toast.success(`"${qrCode.name}" archived`);
    } catch (error) {
      console.error('Error archiving QR code:', error);
      toast.error('Failed to archive QR code');
      throw error;
    }
  };

  const restoreQRCode = async (qrCode: QRCode) => {
    try {
      const updated = await designService.restoreDesign(qrCode.id);
      if (!updated) {
        throw new Error('Failed to restore');
      }

      const updatedQRCodes = qrCodes.map(qr => (qr.id === qrCode.id ? { ...qr, isArchived: false } : qr));
      setQrCodes(updatedQRCodes);
      setFilteredQRCodes(
        searchQuery
          ? updatedQRCodes.filter(qr =>
              qr.name.toLowerCase().includes(searchQuery.toLowerCase())
              || qr.url.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          : updatedQRCodes,
      );

      toast.success(`"${qrCode.name}" restored`);
    } catch (error) {
      console.error('Error restoring QR code:', error);
      toast.error('Failed to restore QR code');
      throw error;
    }
  };

  const deleteQRCodePermanently = async (qrCode: QRCode) => {
    try {
      await designService.deleteDesign(qrCode.id);
      await fetchQRCodes(); // Refresh the list
      toast.success('QR code deleted permanently');
    } catch (error) {
      console.error('Error deleting QR code permanently:', error);
      toast.error('Failed to delete QR code permanently');
    }
  };

  // Helper function to check if current user owns the QR code
  const isOwnedByCurrentUser = (qrCode: QRCode): boolean => {
    return currentUserId === qrCode.createdBy;
  };

  // Bulk actions for selected QR codes
  const deleteSelectedQRCodes = async () => {
    try {
      const selectedCodes = qrCodes.filter(qr => selectedQRCodes.includes(qr.id));
      const ownedCodes = selectedCodes.filter(qr => isOwnedByCurrentUser(qr));

      if (ownedCodes.length === 0) {
        toast.error('No owned QR codes selected for deletion');
        return;
      }

      // Delete each owned QR code
      for (const qrCode of ownedCodes) {
        await designService.deleteDesign(qrCode.id);
      }

      // Clear selection and refresh
      setSelectedQRCodes([]);
      await fetchQRCodes();
      toast.success(`Deleted ${ownedCodes.length} QR code${ownedCodes.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error deleting selected QR codes:', error);
      toast.error('Failed to delete selected QR codes');
    }
  };

  const archiveSelectedQRCodes = async () => {
    try {
      const selectedCodes = qrCodes.filter(qr => selectedQRCodes.includes(qr.id));
      const ownedCodes = selectedCodes.filter(qr => isOwnedByCurrentUser(qr));

      if (ownedCodes.length === 0) {
        toast.error('No owned QR codes selected for archiving');
        return;
      }

      // Archive each owned QR code
      for (const qrCode of ownedCodes) {
        await designService.archiveDesign(qrCode.id);
      }

      // Clear selection and refresh
      setSelectedQRCodes([]);
      await fetchQRCodes();
      toast.success(`Archived ${ownedCodes.length} QR code${ownedCodes.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error archiving selected QR codes:', error);
      toast.error('Failed to archive selected QR codes');
    }
  };

  const clearSelection = () => {
    setSelectedQRCodes([]);
  };

  return {
    searchQuery,
    viewMode: 'list', // This will be managed within the component
    qrCodes,
    filteredQRCodes,
    selectedQRCodes,
    setSelectedQRCodes,
    isLoading,
    downloadModalOpen,
    selectedQRCodeForDownload,

    deleteModalOpen,
    selectedQRCodeForDelete,
    currentUserId,
    isOwnedByCurrentUser,
    handleSearch,
    clearSearch,
    toggleQRCodeSelection,
    isQRCodeSelected,
    updateQRCodeName,
    handleDownload,
    closeDownloadModal,

    handleEditQRCode,
    handleEditDesign,
    handleDeleteQRCode,
    closeDeleteModal,
    // Rewired actions for archive lifecycle
    archiveQRCode,
    restoreQRCode,
    deleteQRCodePermanently,
    refreshQRCodes: fetchQRCodes,
    deleteSelectedQRCodes,
    archiveSelectedQRCodes,
    clearSelection,
  };
};
