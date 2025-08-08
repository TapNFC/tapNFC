'use client';

import { MoreHorizontal } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type TextContextualToolbarProps = {
  isVisible: boolean;
  position: { x: number; y: number };
  onLinkClick: () => void;
  onClose: () => void;
};

export function TextContextualToolbar({
  isVisible,
  position,
  onLinkClick,
  onClose,
}: TextContextualToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the toolbar to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Handle escape key to close the toolbar
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape, true);
    };
  }, [isVisible, onClose]);

  // Capture keyboard events to prevent them from reaching the canvas
  useEffect(() => {
    const captureKeyboardEvents = (e: KeyboardEvent) => {
      if (isVisible && toolbarRef.current?.contains(e.target as Node)) {
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', captureKeyboardEvents, true);
    document.addEventListener('keyup', captureKeyboardEvents, true);
    document.addEventListener('keypress', captureKeyboardEvents, true);

    return () => {
      document.removeEventListener('keydown', captureKeyboardEvents, true);
      document.removeEventListener('keyup', captureKeyboardEvents, true);
      document.removeEventListener('keypress', captureKeyboardEvents, true);
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  // Calculate toolbar position with boundary checking
  const toolbarWidth = 48; // Width of the toolbar
  const toolbarHeight = 40; // Height of the toolbar
  const padding = 16;

  const calculatedLeft = Math.max(
    padding,
    Math.min(
      position.x - toolbarWidth / 2,
      window.innerWidth - toolbarWidth - padding,
    ),
  );

  const calculatedTop = Math.max(
    padding,
    position.y - toolbarHeight - 20, // Position above with 20px gap`
  );

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 flex items-center gap-1 rounded-xl border border-white/30 bg-white/95 p-1 shadow-2xl shadow-blue-500/20 backdrop-blur-xl"
      style={{
        left: calculatedLeft,
        top: calculatedTop,
      }}
    >
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              onClick={onLinkClick}
              variant="ghost"
              size="sm"
              className="size-8 rounded-lg p-0 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-800 text-white">
            <p>Text actions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Arrow pointing down to element */}
      <div
        className="absolute -bottom-2 h-2 w-4 bg-white/95"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
        }}
      />
    </div>
  );
}
