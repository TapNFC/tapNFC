'use client';

import type { QRCode } from '@/types/qr-code';
import { useMemo, useState } from 'react';
import { useQRCodesQuery } from './useQRCodesQuery';

export const useQRCodesWithQuery = (locale: string = 'en') => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQRCodes, setSelectedQRCodes] = useState<string[]>([]);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedQRCodeForDownload, setSelectedQRCodeForDownload] = useState<QRCode | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQRCodeForDelete, setSelectedQRCodeForDelete] = useState<QRCode | null>(null);

  const {
    qrCodes,
    isLoading,
    currentUser,
    isOwnedByCurrentUser,
    refetchQRCodes,
    updateQRCodeName: updateQRCodeNameMutation,
    deleteQRCode: deleteQRCodeMutation,
    duplicateQRCode,
    archiveQRCode: archiveQRCodeMutation,
    restoreQRCode: restoreQRCodeMutation,
  } = useQRCodesQuery(locale);

  // Filter QR codes based on search query
  const filteredQRCodes = useMemo(() => {
    if (!searchQuery) {
      return qrCodes;
    }

    return qrCodes.filter(qr =>
      qr.name.toLowerCase().includes(searchQuery.toLowerCase())
      || qr.url.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [qrCodes, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
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
    updateQRCodeNameMutation({ id, newName });
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
    await archiveQRCodeMutation(qrCode.id);
    // Clean selection
    if (selectedQRCodes.includes(qrCode.id)) {
      setSelectedQRCodes(prev => prev.filter(id => id !== qrCode.id));
    }
  };

  const restoreQRCode = async (qrCode: QRCode) => {
    await restoreQRCodeMutation(qrCode.id);
  };

  const deleteQRCodePermanently = async (qrCode: QRCode) => {
    await deleteQRCodeMutation(qrCode.id);
    // Clean selection
    if (selectedQRCodes.includes(qrCode.id)) {
      setSelectedQRCodes(prev => prev.filter(id => id !== qrCode.id));
    }
  };

  const duplicateQRCodeAndPromptRegeneration = async (qrCode: QRCode) => {
    try {
      const duplicatedDesign: any = await duplicateQRCode(qrCode.id);
      if (!duplicatedDesign) {
        return;
      }

      // Redirect user to the QR regeneration flow for the new design
      window.location.href = `/${locale}/design/${duplicatedDesign.id}/qr-code`;
    } catch (error) {
      console.error('Error duplicating QR code:', error);
    }
  };

  // Bulk actions for selected QR codes
  const deleteSelectedQRCodes = async () => {
    try {
      const selectedCodes = qrCodes.filter(qr => selectedQRCodes.includes(qr.id));
      const ownedCodes = selectedCodes.filter(qr => isOwnedByCurrentUser(qr));

      if (ownedCodes.length === 0) {
        throw new Error('No owned QR codes selected for deletion');
      }

      // Delete each owned QR code
      for (const qrCode of ownedCodes) {
        await deleteQRCodeMutation(qrCode.id);
      }

      // Clear selection
      setSelectedQRCodes([]);
    } catch (error) {
      console.error('Error deleting selected QR codes:', error);
      throw error;
    }
  };

  const archiveSelectedQRCodes = async () => {
    try {
      const selectedCodes = qrCodes.filter(qr => selectedQRCodes.includes(qr.id));
      const ownedCodes = selectedCodes.filter(qr => isOwnedByCurrentUser(qr));

      if (ownedCodes.length === 0) {
        throw new Error('No owned QR codes selected for archiving');
      }

      // Archive each owned QR code
      for (const qrCode of ownedCodes) {
        await archiveQRCodeMutation(qrCode.id);
      }

      // Clear selection
      setSelectedQRCodes([]);
    } catch (error) {
      console.error('Error archiving selected QR codes:', error);
      throw error;
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
    currentUserId: currentUser?.id || null,
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
    archiveQRCode,
    restoreQRCode,
    deleteQRCodePermanently,
    refreshQRCodes: refetchQRCodes,
    deleteSelectedQRCodes,
    archiveSelectedQRCodes,
    clearSelection,
    duplicateQRCodeAndPromptRegeneration,
  };
};
