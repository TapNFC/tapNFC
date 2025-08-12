import type { ComponentProps } from 'react';
import React from 'react';
import { TextToolbar } from '../TextToolbar';
import { LinkEditPopup } from './LinkEditPopup';
import { RealTimePreview } from './RealTimePreview';
import { SocialIconContextualToolbar } from './SocialIconContextualToolbar';

// Memoized Link Edit Popup
export const MemoizedLinkEditPopup = React.memo(LinkEditPopup);
MemoizedLinkEditPopup.displayName = 'MemoizedLinkEditPopup';

// Memoized Real Time Preview with proper prop comparison
export const MemoizedRealTimePreview = React.memo(
  RealTimePreview,
  (prevProps, nextProps) => {
    // Custom comparison to avoid unnecessary re-renders
    return (
      prevProps.width === nextProps.width
      && prevProps.height === nextProps.height
      && prevProps.backgroundColor === nextProps.backgroundColor
      && JSON.stringify(prevProps.canvasState) === JSON.stringify(nextProps.canvasState)
    );
  },
);
MemoizedRealTimePreview.displayName = 'MemoizedRealTimePreview';

// Memoized Text Toolbar
export const MemoizedTextToolbar = React.memo(
  TextToolbar,
  (prevProps, nextProps) => {
    // Only re-render if canvas or selectedObject changes
    return (
      prevProps.canvas === nextProps.canvas
      && prevProps.selectedObject === nextProps.selectedObject
    );
  },
);
MemoizedTextToolbar.displayName = 'MemoizedTextToolbar';

// Memoized Social Icon Contextual Toolbar
export const MemoizedSocialIconContextualToolbar = React.memo(
  SocialIconContextualToolbar,
  (prevProps, nextProps) => {
    // Only re-render if visibility, position, or callbacks change
    return (
      prevProps.isVisible === nextProps.isVisible
      && prevProps.position.x === nextProps.position.x
      && prevProps.position.y === nextProps.position.y
      && prevProps.onActionsClick === nextProps.onActionsClick
      && prevProps.onClose === nextProps.onClose
    );
  },
);
MemoizedSocialIconContextualToolbar.displayName = 'MemoizedSocialIconContextualToolbar';

// Generic memoized wrapper for design editor components
export function withMemo<T extends ComponentProps<any>>(
  Component: React.ComponentType<T>,
  displayName?: string,
) {
  const MemoizedComponent = React.memo(Component);
  MemoizedComponent.displayName = displayName || `Memoized${Component.displayName || Component.name}`;
  return MemoizedComponent;
}
