// Design Editor Constants
export const DESIGN_EDITOR_CONFIG = {
  // Auto-save configuration
  AUTO_SAVE_INTERVAL: 2000, // milliseconds

  // Canvas loading delays
  CANVAS_CONTEXT_DELAY: 500, // milliseconds - increased from 150ms to 500ms

  // Default canvas dimensions
  DEFAULT_CANVAS: {
    WIDTH: 375,
    HEIGHT: 667,
    BACKGROUND_COLOR: '#ffffff',
  },

  // Canvas event names
  CANVAS_EVENTS: {
    OBJECT_ADDED: 'object:added',
    OBJECT_REMOVED: 'object:removed',
    OBJECT_MODIFIED: 'object:modified',
    OBJECT_MOVING: 'object:moving',
    OBJECT_SCALING: 'object:scaling',
    OBJECT_ROTATING: 'object:rotating',
    CANVAS_BACKGROUND_CHANGED: 'canvas:background:changed',
    MOUSE_DOUBLE_CLICK: 'mouse:dblclick',
  },

  // Element types
  ELEMENT_TYPES: {
    LINK: 'link',
  },

  // Local storage keys
  STORAGE_KEYS: {
    DESIGN_PREFIX: 'design_',
  },

  // CSS classes for consistent styling
  BACKGROUND_CLASSES: {
    MAIN: 'flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50',
    PAGE: 'min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50',
    LAYOUT: 'relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/90',
    PATTERN: 'absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.15)_1px,transparent_0)] opacity-30 [background-size:20px_20px]',
    ORB_1: 'absolute left-1/4 top-1/4 size-96 animate-pulse rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl',
    ORB_2: 'absolute bottom-1/4 right-1/4 size-80 animate-pulse rounded-full bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 blur-3xl delay-1000',
  },
} as const;

// Type definitions for better type safety
export type CanvasEventType = typeof DESIGN_EDITOR_CONFIG.CANVAS_EVENTS[keyof typeof DESIGN_EDITOR_CONFIG.CANVAS_EVENTS];
export type ElementType = typeof DESIGN_EDITOR_CONFIG.ELEMENT_TYPES[keyof typeof DESIGN_EDITOR_CONFIG.ELEMENT_TYPES];
