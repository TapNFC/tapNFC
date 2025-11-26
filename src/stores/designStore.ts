import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type DesignElement = {
  id: string;
  type: 'text' | 'image' | 'shape' | 'icon' | 'button' | 'link';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  // Type-specific properties
  text?: {
    content: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    lineHeight: number;
  };
  image?: {
    src: string;
    alt: string;
    objectFit: 'cover' | 'contain' | 'fill';
  };
  shape?: {
    type: 'rectangle' | 'circle' | 'triangle' | 'line' | 'diamond';
    fill: string;
    stroke: string;
    strokeWidth: number;
    borderRadius?: number;
  };
  icon?: {
    name: string;
    color: string;
    size: number;
  };
  button?: {
    text: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    fontSize: number;
    fontWeight: string;
    padding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    hoverBackgroundColor?: string;
    hoverTextColor?: string;
    action?: {
      type: 'url' | 'email' | 'phone' | 'custom';
      value: string;
    };
  };
  link?: {
    text: string;
    url: string;
    color: string;
    fontSize: number;
    fontWeight: string;
    textDecoration: 'none' | 'underline' | 'line-through';
    hoverColor?: string;
    target: '_blank' | '_self' | '_parent' | '_top';
  };
};

export type CanvasSize = {
  width: number;
  height: number;
};

type DesignState = {
  elements: DesignElement[];
  selectedElements: string[];
  canvasSize: CanvasSize;
  zoom: number;
  history: DesignElement[][];
  historyIndex: number;
  clipboard: DesignElement[];
};

type DesignActions = {
  // Element management
  addElement: (element: Omit<DesignElement, 'id' | 'zIndex'>) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;

  // Selection
  selectElement: (id: string) => void;
  selectMultipleElements: (ids: string[]) => void;
  clearSelection: () => void;

  // Canvas
  setCanvasSize: (size: CanvasSize) => void;
  setZoom: (zoom: number) => void;

  // History
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;

  // Clipboard
  copyElements: (ids: string[]) => void;
  pasteElements: () => void;

  // Layer management
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;

  // Utility
  getElementById: (id: string) => DesignElement | undefined;
  getSelectedElements: () => DesignElement[];
  resetDesign: () => void;
};

const initialState: DesignState = {
  elements: [],
  selectedElements: [],
  canvasSize: { width: 800, height: 600 },
  zoom: 1,
  history: [[]],
  historyIndex: 0,
  clipboard: [],
};

export const useDesignStore = create<DesignState & DesignActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      addElement: (elementData) => {
        const newElement: DesignElement = {
          ...elementData,
          id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          zIndex: Math.max(...get().elements.map(el => el.zIndex), 0) + 1,
        };

        set(state => ({
          elements: [...state.elements, newElement],
        }));
        get().saveToHistory();
      },

      updateElement: (id, updates) => {
        set(state => ({
          elements: state.elements.map(el =>
            el.id === id ? { ...el, ...updates } : el,
          ),
        }));
        get().saveToHistory();
      },

      deleteElement: (id) => {
        set(state => ({
          elements: state.elements.filter(el => el.id !== id),
          selectedElements: state.selectedElements.filter(selectedId => selectedId !== id),
        }));
        get().saveToHistory();
      },

      duplicateElement: (id) => {
        const element = get().getElementById(id);
        if (element) {
          const duplicated = {
            ...element,
            x: element.x + 20,
            y: element.y + 20,
          };
          delete (duplicated as any).id;
          delete (duplicated as any).zIndex;
          get().addElement(duplicated);
        }
      },

      selectElement: (id) => {
        set({ selectedElements: [id] });
      },

      selectMultipleElements: (ids) => {
        set({ selectedElements: ids });
      },

      clearSelection: () => {
        set({ selectedElements: [] });
      },

      setCanvasSize: (size) => {
        set({ canvasSize: size });
      },

      setZoom: (zoom) => {
        set({ zoom: Math.max(0.1, Math.min(5, zoom)) });
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          set({
            elements: history[newIndex],
            historyIndex: newIndex,
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          set({
            elements: history[newIndex],
            historyIndex: newIndex,
          });
        }
      },

      saveToHistory: () => {
        const { elements, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...elements]);

        // Limit history to 50 entries
        if (newHistory.length > 50) {
          newHistory.shift();
        } else {
          set({
            history: newHistory,
            historyIndex: newHistory.length - 1,
          });
        }
      },

      copyElements: (ids) => {
        const elements = get().elements.filter(el => ids.includes(el.id));
        set({ clipboard: elements });
      },

      pasteElements: () => {
        const { clipboard } = get();
        clipboard.forEach((element) => {
          const elementCopy = {
            ...element,
            x: element.x + 20,
            y: element.y + 20,
          };
          delete (elementCopy as any).id;
          delete (elementCopy as any).zIndex;
          get().addElement(elementCopy);
        });
      },

      bringToFront: (id) => {
        const maxZ = Math.max(...get().elements.map(el => el.zIndex));
        get().updateElement(id, { zIndex: maxZ + 1 });
      },

      sendToBack: (id) => {
        const minZ = Math.min(...get().elements.map(el => el.zIndex));
        get().updateElement(id, { zIndex: minZ - 1 });
      },

      bringForward: (id) => {
        const element = get().getElementById(id);
        if (element) {
          get().updateElement(id, { zIndex: element.zIndex + 1 });
        }
      },

      sendBackward: (id) => {
        const element = get().getElementById(id);
        if (element) {
          get().updateElement(id, { zIndex: element.zIndex - 1 });
        }
      },

      getElementById: (id) => {
        return get().elements.find(el => el.id === id);
      },

      getSelectedElements: () => {
        const { elements, selectedElements } = get();
        return elements.filter(el => selectedElements.includes(el.id));
      },

      resetDesign: () => {
        set(initialState);
      },
    }),
    { name: 'design-store' },
  ),
);
