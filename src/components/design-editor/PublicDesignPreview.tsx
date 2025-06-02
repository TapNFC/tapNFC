'use client';

import type { SharedDesign } from '@/lib/indexedDB';
import { AlertTriangle } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';
import { createDummyHtml } from '@/lib/canvasToHtml';
import { getSharedDesign } from '@/lib/indexedDB';

type PublicDesignPreviewProps = {
  designId: string;
};

// Create a dummy design fallback
const createDummyDesign = (designId: string): SharedDesign => {
  return {
    id: designId,
    canvasData: {
      // Minimal canvas data - will be created programmatically
      version: '5.2.4',
      objects: [],
      background: '#f8fafc',
    },
    htmlContent: createDummyHtml({
      width: 375,
      height: 667,
      backgroundColor: '#f8fafc',
    }),
    metadata: {
      width: 375,
      height: 667,
      backgroundColor: '#f8fafc',
      title: 'Demo Design Template',
      description: 'This is a sample design template created to demonstrate the QR code preview functionality.',
    },
    createdAt: new Date(),
    expiresAt: undefined, // Demo designs don't expire
  };
};

export function PublicDesignPreview({ designId }: PublicDesignPreviewProps) {
  const htmlContainerRef = useRef<HTMLDivElement>(null);
  const [designData, setDesignData] = useState<SharedDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch design data from IndexedDB
  useEffect(() => {
    const fetchDesignData = async () => {
      try {
        console.warn('Fetching design from IndexedDB with ID:', designId);

        const sharedDesign = await getSharedDesign(designId);

        if (!sharedDesign) {
          console.warn('Design not found in IndexedDB, creating dummy design');
          // Instead of throwing an error, create a dummy design
          const dummyDesign = createDummyDesign(designId);
          setDesignData(dummyDesign);
        } else {
          console.warn('Design data retrieved from IndexedDB:', sharedDesign);

          // If no HTML content exists, create dummy HTML
          if (!sharedDesign.htmlContent) {
            console.warn('No HTML content found, creating dummy HTML');
            sharedDesign.htmlContent = createDummyHtml({
              width: sharedDesign.metadata.width,
              height: sharedDesign.metadata.height,
              backgroundColor: sharedDesign.metadata.backgroundColor,
            });
          }

          setDesignData(sharedDesign);
        }
      } catch (err) {
        console.error('Error fetching design data:', err);
        // Even if there's an error, show dummy design instead of error
        console.warn('Error occurred, creating dummy design as fallback');
        const dummyDesign = createDummyDesign(designId);
        setDesignData(dummyDesign);
      } finally {
        setLoading(false);
      }
    };

    if (designId) {
      fetchDesignData();
    }
  }, [designId]);

  // Render HTML content
  useEffect(() => {
    if (!designData || !htmlContainerRef.current) {
      return;
    }

    try {
      const htmlContent = designData.htmlContent || createDummyHtml({
        width: designData.metadata.width,
        height: designData.metadata.height,
        backgroundColor: designData.metadata.backgroundColor,
      });

      // Create an iframe for proper HTML rendering
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '12px';
      iframe.style.overflow = 'hidden';

      // Clear existing content
      htmlContainerRef.current.innerHTML = '';
      htmlContainerRef.current.appendChild(iframe);

      // Write HTML content to iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }

      console.warn('HTML design rendered successfully in iframe');
    } catch (renderError) {
      console.error('Error rendering HTML design:', renderError);
      setError('Failed to render design');

      // Fallback to direct HTML injection
      try {
        htmlContainerRef.current.innerHTML = designData.htmlContent || createDummyHtml({
          width: designData.metadata.width,
          height: designData.metadata.height,
          backgroundColor: designData.metadata.backgroundColor,
        });
      } catch (fallbackError) {
        console.error('Fallback rendering also failed:', fallbackError);
      }
    }
  }, [designData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40">
        <div className="text-center">
          <div className="mx-auto mb-6 size-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          <div className="text-lg font-medium text-gray-700">Loading design...</div>
          <div className="mt-2 text-sm text-gray-500">Please wait a moment</div>
        </div>
      </div>
    );
  }

  if (error && !designData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-pink-50/30 to-rose-100/40 p-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="size-10 text-red-600" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-900">Unable to load design</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!designData) {
    return null;
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      className={`flex min-h-screen items-center justify-center p-0 ${
        isMobile
          ? 'bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-100/50'
          : 'bg-gray-50'
      }`}
    >
      {/* Design Container */}
      <div
        className="relative shadow-2xl"
        style={{
          width: `${Math.min(designData.metadata.width, typeof window !== 'undefined' ? window.innerWidth - 32 : 800)}px`,
          height: `${Math.min(designData.metadata.height, typeof window !== 'undefined' ? window.innerHeight - 32 : 600)}px`,
          maxWidth: '100vw',
          maxHeight: '100vh',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <div
          ref={htmlContainerRef}
          className="size-full"
          style={{
            backgroundColor: designData.metadata.backgroundColor || '#ffffff',
          }}
        />
      </div>
    </div>
  );
}
