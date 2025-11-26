'use client';

import type { UseQrCodeGeneratorReturn } from '@/hooks/useQrCodeGenerator';
import { Check, Copy, Download, Eye, Pencil, Save, Share2 } from 'lucide-react';
import { QrCodeSamples } from '@/components/design-editor/QrCodeSamples';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type QrCodePreviewCardProps = Pick<
  UseQrCodeGeneratorReturn,
  | 'isImageQr'
  | 'qrUrl'
  | 'qrSize'
  | 'isGenerating'
  | 'qrPreviewDisplay'
  | 'handleSampleSelect'
  | 'selectedQrSample'
  | 'copied'
  | 'copyToClipboard'
  | 'downloadQrCode'
  | 'previewDesign'
  | 'shareDesign'
  | 'saveQrCodeToStorage'
  | 'isSaving'
  | 'qrCodeUrl'
  | 'qrCodeSvgData'
  | 'editQrCode'
  | 'isEditMode'
  | 'downloadFormat'
  | 'setDownloadFormat'
>;

export function QrCodePreviewCard({
  isImageQr,
  qrUrl,
  qrSize,
  isGenerating,
  qrPreviewDisplay,
  handleSampleSelect,
  selectedQrSample,
  copied,
  copyToClipboard,
  downloadQrCode,
  previewDesign,
  shareDesign,
  saveQrCodeToStorage,
  isSaving,
  qrCodeUrl,
  qrCodeSvgData,
  editQrCode,
  isEditMode,
  downloadFormat,
  setDownloadFormat,
}: QrCodePreviewCardProps) {
  // Available resolutions for download
  const resolutions = [256, 512, 1024, 2048];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Share2 className="size-5 text-green-600" />
          <span>Your QR Code</span>
        </CardTitle>
        <CardDescription>
          {isImageQr
            ? 'Scan this QR code to download the original image directly'
            : 'Scan this QR code to view your design or share it with others'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGenerating
          ? (
              <div className="flex size-full flex-col items-center justify-center">
                <div className="relative mb-4 size-48 rounded-lg">
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200"></div>
                  <div className="absolute inset-4 grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, index) => (
                      <div
                        key={`qr-skeleton-pixel-${index}`}
                        className={`rounded-sm ${
                          Math.random() > 0.5
                            ? 'bg-gray-400'
                            : 'bg-transparent'
                        } opacity-40`}
                      >
                      </div>
                    ))}
                  </div>
                  <div className="absolute left-3 top-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                  <div className="absolute right-3 top-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                  <div className="absolute bottom-3 left-3 size-8 rounded-lg bg-gray-400 opacity-60"></div>
                </div>
                <p className="text-center text-sm font-medium text-blue-600">
                  {qrCodeUrl ? 'Loading saved QR code...' : 'Generating your QR code...'}
                </p>
              </div>
            )
          : qrUrl && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div
                  id="qr-code-preview-container"
                  className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-lg"
                  style={{ width: qrSize, height: qrSize }}
                >
                  {qrPreviewDisplay && (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {qrPreviewDisplay}
                      {qrCodeUrl && !isEditMode && (
                        <div className="absolute -top-2 right-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Saved QR
                        </div>
                      )}
                      {isEditMode && (
                        <div className="absolute -top-2 right-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Edit Mode
                        </div>
                      )}
                      {qrCodeUrl && !isEditMode && (
                        <Button
                          onClick={editQrCode}
                          className="absolute bottom-2 right-2 size-8 rounded-full bg-blue-500 p-1 hover:bg-blue-600"
                          title="Edit QR Code"
                        >
                          <Pencil className="size-4 text-white" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold">Choose a Style</h3>
                <p className="mb-4 text-sm text-gray-500">
                  {qrCodeUrl && !isEditMode
                    ? 'This QR code has been saved. Style selection is disabled.'
                    : 'Select a style to make your QR code stand out.'}
                </p>
                <QrCodeSamples
                  onSampleSelect={handleSampleSelect}
                  currentSelectedId={selectedQrSample?.id}
                  disabled={!!qrCodeUrl && !isEditMode}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Preview URL</Label>
                  <div className="flex items-center space-x-2 rounded-lg border bg-muted/30 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="break-all font-mono text-sm text-muted-foreground">
                        {qrUrl}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex shrink-0 items-center space-x-2 hover:bg-background"
                      disabled={isGenerating}
                    >
                      {copied
                        ? (
                            <>
                              <Check className="size-4 text-green-600" />
                              <span className="text-xs">Copied!</span>
                            </>
                          )
                        : (
                            <>
                              <Copy className="size-4" />
                              <span className="text-xs">Copy</span>
                            </>
                          )}
                    </Button>
                  </div>
                </div>

                {/* Format selection */}
                <div className="space-y-2">
                  <Label>Download format</Label>
                  <Select
                    value={downloadFormat}
                    onValueChange={value => setDownloadFormat(value as 'PNG' | 'SVG' | 'JPEG')}
                  >
                    <SelectTrigger className="w-full sm:w-56">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PNG">PNG (raster)</SelectItem>
                      <SelectItem value="SVG">SVG (vector)</SelectItem>
                      <SelectItem value="JPEG">JPEG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <Button
                  onClick={saveQrCodeToStorage}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  disabled={isSaving || (!!qrCodeUrl && !isEditMode)}
                >
                  {isSaving
                    ? (
                        <>
                          <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Saving...</span>
                        </>
                      )
                    : qrCodeUrl && !isEditMode
                      ? (
                          <>
                            <Check className="size-4" />
                            <span>Saved</span>
                          </>
                        )
                      : (
                          <>
                            <Save className="size-4" />
                            <span>{qrCodeUrl && isEditMode ? 'Update QR' : 'Save QR'}</span>
                          </>
                        )}
                </Button>

                {/* Download dropdown with resolution options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                      disabled={isGenerating || !qrCodeUrl}
                    >
                      <Download className="size-4" />
                      <span>Download</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem onClick={() => downloadQrCode()}>
                      Default Size (
                      {qrSize}
                      px)
                    </DropdownMenuItem>
                    {(qrCodeSvgData || isEditMode) && (
                      <>
                        <Separator className="my-1" />
                        {resolutions.map(resolution => (
                          <DropdownMenuItem
                            key={`resolution-${resolution}`}
                            onClick={() => downloadQrCode(resolution)}
                          >
                            {resolution}
                            x
                            {resolution}
                            px
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  onClick={previewDesign}
                  className="flex items-center space-x-2"
                  disabled={isGenerating}
                >
                  <Eye className="size-4" />
                  <span>{isImageQr ? 'Open Image' : 'Preview'}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={shareDesign}
                  className="flex items-center space-x-2"
                  disabled={isGenerating}
                >
                  <Share2 className="size-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
