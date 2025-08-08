'use client';

import type { QRCode } from '@/types/qr-code';
import { Grid3X3, List, QrCode, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQRCodes } from '@/hooks/use-qrcodes';
import { cn } from '@/lib/utils';
import {
  CustomUrlModal,
  DeleteQRCodeDialog,
  DownloadModal,
  EmptyState,
  QRCodeGridItem,
  QRCodeListItem,
} from './components';

type ElegantQRCodesProps = {
  locale?: string;
};

type TabType = 'all' | 'active' | 'archive';

export default function ElegantQRCodes({ locale = 'en' }: ElegantQRCodesProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQRCodeForDelete, setSelectedQRCodeForDelete] = useState<QRCode | null>(null);
  const router = useRouter();
  const {
    searchQuery,
    filteredQRCodes,
    isLoading,
    downloadModalOpen,
    selectedQRCodeForDownload,
    customUrlModalOpen,
    selectedQRCodeForCustomUrl,
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
    archiveQRCode,
    restoreQRCode,
    deleteQRCodePermanently,
  } = useQRCodes();

  const handleCreateQRCode = () => {
    router.push(`/${locale}/design`);
  };

  const handleDeleteForever = (qrCode: QRCode) => {
    setSelectedQRCodeForDelete(qrCode);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (qrCode: QRCode) => {
    try {
      await deleteQRCodePermanently(qrCode);
      setDeleteModalOpen(false);
      setSelectedQRCodeForDelete(null);
    } catch (error) {
      console.error('Error deleting QR code:', error);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedQRCodeForDelete(null);
  };

  // Filter QR codes based on active tab
  const getFilteredQRCodesByTab = () => {
    switch (activeTab) {
      case 'active':
        return filteredQRCodes.filter(qr => !qr.isArchived);
      case 'archive':
        return filteredQRCodes.filter(qr => qr.isArchived);
      case 'all':
      default:
        return filteredQRCodes;
    }
  };

  const tabFilteredQRCodes = getFilteredQRCodesByTab();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QR Codes</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Manage and track your QR code collection</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCreateQRCode}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-sm transition-all hover:from-blue-600 hover:to-cyan-700 hover:shadow"
              >
                <QrCode className="mr-2 size-4" />
                Create QR Code
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={value => setActiveTab(value as TabType)} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-white shadow-sm dark:bg-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-300">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-300">
                Active
              </TabsTrigger>
              <TabsTrigger value="archive" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 dark:data-[state=active]:bg-orange-900/20 dark:data-[state=active]:text-orange-300">
                Archive
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search QR codes..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="border-gray-200 bg-white pl-10 shadow-sm transition-all focus-visible:shadow dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Button size="sm" variant={viewMode === 'grid' ? 'primary' : 'ghost'} onClick={() => setViewMode('grid')} className="h-8 px-3">
              <Grid3X3 className="size-4" />
            </Button>
            <Button size="sm" variant={viewMode === 'list' ? 'primary' : 'ghost'} onClick={() => setViewMode('list')} className="h-8 px-3">
              <List className="size-4" />
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading QR codes...</p>
            </div>
          </div>
        )}
        {!isLoading && (
          <>
            <div
              className={cn(
                'gap-4',
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
                  : 'space-y-4',
              )}
            >
              {tabFilteredQRCodes.map(qrCode => (
                <div key={qrCode.id}>
                  {viewMode === 'list'
                    ? (
                        <QRCodeListItem
                          qrCode={qrCode}
                          isSelected={isQRCodeSelected(qrCode.id)}
                          onToggleSelection={toggleQRCodeSelection}
                          onUpdateName={updateQRCodeName}
                          onDownload={handleDownload}
                          onEditQRCode={handleEditQRCode}
                          onEditDesign={handleEditDesign}
                          onCustomUrl={handleCustomUrl}
                          onArchive={archiveQRCode}
                          onRestore={restoreQRCode}
                          onDeleteForever={handleDeleteForever}
                        />
                      )
                    : (
                        <QRCodeGridItem
                          qrCode={qrCode}
                          isSelected={isQRCodeSelected(qrCode.id)}
                          onToggleSelection={toggleQRCodeSelection}
                          onUpdateName={updateQRCodeName}
                          onDownload={handleDownload}
                          onEditQRCode={handleEditQRCode}
                          onEditDesign={handleEditDesign}
                          onCustomUrl={handleCustomUrl}
                          onArchive={archiveQRCode}
                          onRestore={restoreQRCode}
                          onDeleteForever={handleDeleteForever}
                        />
                      )}
                </div>
              ))}
            </div>

            {tabFilteredQRCodes.length === 0 && <EmptyState onClearSearch={clearSearch} />}
          </>
        )}

        <DownloadModal isOpen={downloadModalOpen} onClose={closeDownloadModal} qrCode={selectedQRCodeForDownload} />

        <CustomUrlModal isOpen={customUrlModalOpen} onClose={closeCustomUrlModal} qrCode={selectedQRCodeForCustomUrl} />

        <DeleteQRCodeDialog
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleConfirmDelete}
          qrCode={selectedQRCodeForDelete}
        />
      </div>
    </div>
  );
}
