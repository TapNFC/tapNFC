'use client';

import type { QRCode, QRCodeStats } from '@/types/qr-code';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { designService } from '@/services/designService';

export const useQRCodes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [filteredQRCodes, setFilteredQRCodes] = useState<QRCode[]>([]);
  const [selectedQRCodes, setSelectedQRCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setQrCodeStats] = useState<Record<string, QRCodeStats>>({});
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedQRCodeForDownload, setSelectedQRCodeForDownload] = useState<QRCode | null>(null);
  const [customUrlModalOpen, setCustomUrlModalOpen] = useState(false);
  const [selectedQRCodeForCustomUrl, setSelectedQRCodeForCustomUrl] = useState<QRCode | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQRCodeForDelete, setSelectedQRCodeForDelete] = useState<QRCode | null>(null);

  const fetchQRCodes = async () => {
    try {
      setIsLoading(true);
      const designs = await designService.getUserQrCodes();

      const transformedQRCodes: QRCode[] = designs.map((design) => {
        const baseUrl = window.location.origin;
        const locale = document.documentElement.lang || 'en';

        return {
          id: design.id,
          name: design.name,
          url: `${baseUrl}/${locale}/preview/${design.id}`,
          scans: 0,
          type: design.is_template ? 'Template' : 'Design',
          created: new Date(design.created_at).toLocaleDateString(),
          previewImage: design.preview_url || '/assets/images/nextjs-starter-banner.png',
          qrCodeUrl: design.qr_code_url || null,
          qrCodeData: design.qr_code_data || null,
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

      const updatedQRCodes = qrCodes.map(qr =>
        qr.id === id ? { ...qr, name: newName } : qr,
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

  const handleCustomUrl = (qrCode: QRCode) => {
    setSelectedQRCodeForCustomUrl(qrCode);
    setCustomUrlModalOpen(true);
  };

  const closeCustomUrlModal = () => {
    setCustomUrlModalOpen(false);
    setSelectedQRCodeForCustomUrl(null);
  };

  const handleEditQRCode = (qrCode: QRCode) => {
    window.location.href = `/design/${qrCode.id}/qr-code`;
  };

  const handleEditDesign = (qrCode: QRCode) => {
    window.location.href = `/design/${qrCode.id}`;
  };

  const handleDeleteQRCode = (qrCode: QRCode) => {
    setSelectedQRCodeForDelete(qrCode);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedQRCodeForDelete(null);
  };

  const deleteQRCode = async (qrCode: QRCode) => {
    try {
      await designService.updateDesign(qrCode.id, {
        qr_code_url: null,
        qr_code_data: null,
      });

      // Remove the deleted QR code from the state
      const updatedQRCodes = qrCodes.filter(qr => qr.id !== qrCode.id);
      setQrCodes(updatedQRCodes);
      setFilteredQRCodes(
        searchQuery
          ? updatedQRCodes.filter(qr =>
              qr.name.toLowerCase().includes(searchQuery.toLowerCase())
              || qr.url.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          : updatedQRCodes,
      );

      // Remove from selected QR codes if it was selected
      if (selectedQRCodes.includes(qrCode.id)) {
        setSelectedQRCodes(prev => prev.filter(id => id !== qrCode.id));
      }

      toast.success(`QR code for "${qrCode.name}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code');
      throw error;
    }
  };

  return {
    searchQuery,
    viewMode: 'list', // This will be managed within the component
    qrCodes,
    filteredQRCodes,
    selectedQRCodes,
    isLoading,
    downloadModalOpen,
    selectedQRCodeForDownload,
    customUrlModalOpen,
    selectedQRCodeForCustomUrl,
    deleteModalOpen,
    selectedQRCodeForDelete,
    handleSearch,
    clearSearch,
    toggleQRCodeSelection,
    isQRCodeSelected,
    updateQRCodeName,
    handleDownload,
    closeDownloadModal,
    handleCustomUrl,
    closeCustomUrlModal,
    handleEditQRCode,
    handleEditDesign,
    handleDeleteQRCode,
    closeDeleteModal,
    deleteQRCode,
    refreshQRCodes: fetchQRCodes,
  };
};
