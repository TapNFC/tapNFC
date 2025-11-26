import { useCallback, useState } from 'react';

type UseDesignEditorStateReturn = {
  // Dialog states
  showSaveDialog: boolean;
  showLoadDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  setShowLoadDialog: (show: boolean) => void;
  handleShowSaveDialog: () => void;
  handleShowLoadDialog: () => void;

  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  handleToggleSidebar: () => void;

  // Canvas version for triggering updates
  canvasVersion: number;
  incrementCanvasVersion: () => void;

  // Design loading state
  isDesignLoaded: boolean;
  setIsDesignLoaded: (loaded: boolean) => void;

  // Selected object state
  selectedObject: any;
  setSelectedObject: (object: any) => void;
};

export function useDesignEditorState(): UseDesignEditorStateReturn {
  // Dialog states
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Canvas version for triggering updates
  const [canvasVersion, setCanvasVersion] = useState(0);

  // Design loading state
  const [isDesignLoaded, setIsDesignLoaded] = useState(false);

  // Selected object state
  const [selectedObject, setSelectedObject] = useState<any>(null);

  // Memoized handlers
  const handleShowSaveDialog = useCallback(() => setShowSaveDialog(true), []);
  const handleShowLoadDialog = useCallback(() => setShowLoadDialog(true), []);
  const handleToggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);
  const incrementCanvasVersion = useCallback(() => setCanvasVersion(prev => prev + 1), []);

  return {
    // Dialog states
    showSaveDialog,
    showLoadDialog,
    setShowSaveDialog,
    setShowLoadDialog,
    handleShowSaveDialog,
    handleShowLoadDialog,

    // Sidebar state
    sidebarCollapsed,
    setSidebarCollapsed,
    handleToggleSidebar,

    // Canvas version
    canvasVersion,
    incrementCanvasVersion,

    // Design loading state
    isDesignLoaded,
    setIsDesignLoaded,

    // Selected object state
    selectedObject,
    setSelectedObject,
  };
}
