import { useCallback, useEffect } from 'react';
import { useTemplateStore } from '@/stores/templateStore';
import { normalizeTextObjects } from '@/utils/textUtils';
import { safeLoadFromJSON, safeRenderAll } from '../utils/canvasSafety';

type UseKeyboardShortcutsOptions = {
  canvas: any;
  fabric: any;
  selectedObject: any;
  onShowSaveDialog: () => void;
  onShowLoadDialog: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  disableShortcuts?: boolean;
};

export function useKeyboardShortcuts({
  canvas,
  fabric,
  selectedObject,
  onShowSaveDialog,
  onShowLoadDialog,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  disableShortcuts = false,
}: UseKeyboardShortcutsOptions) {
  const { templates } = useTemplateStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // If shortcuts are disabled, don't handle any keyboard events
    if (disableShortcuts) {
      return;
    }

    if (!canvas) {
      return;
    }

    const isCtrl = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;

    // Check if we're currently editing text
    const activeObject = canvas.getActiveObject();
    const isEditingText = activeObject
      && (activeObject.type === 'textbox' || activeObject.type === 'i-text')
      && activeObject.isEditing;

    // If editing text, only handle specific shortcuts and let text editing work normally
    if (isEditingText) {
      // Only handle save/load shortcuts while editing text
      if (isCtrl && isShift && event.code === 'KeyS') {
        event.preventDefault();
        onShowSaveDialog();
        return;
      }
      if (isCtrl && event.code === 'KeyO') {
        event.preventDefault();
        onShowLoadDialog();
        return;
      }
      // Let all other keys (including backspace/delete) work normally for text editing
      return;
    }

    // Prevent default for our shortcuts (only when not editing text)
    const shortcuts = [
      'KeyS',
      'KeyO',
      'KeyZ',
      'KeyY',
      'KeyC',
      'KeyV',
      'KeyX',
      'KeyA',
      'Delete',
      'Backspace',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
    ];

    if (isCtrl && shortcuts.includes(event.code)) {
      event.preventDefault();
    }

    try {
      // Template Management Shortcuts
      if (isCtrl && isShift && event.code === 'KeyS') {
        // Ctrl+Shift+S: Save as Template
        onShowSaveDialog();
        return;
      }

      if (isCtrl && event.code === 'KeyO') {
        // Ctrl+O: Load Template
        onShowLoadDialog();
        return;
      }

      // Object Operations (only if object is selected)
      if (selectedObject) {
        if (isCtrl && event.code === 'KeyC') {
          // Ctrl+C: Copy
          const activeObj = canvas.getActiveObject();
          if (activeObj) {
            // Create a deep clone that preserves all custom properties
            activeObj.clone((cloned: any) => {
              // Preserve all custom properties for icons and other elements
              if (activeObj.elementType) {
                cloned.elementType = activeObj.elementType;
              }
              if (activeObj.svgCode) {
                cloned.svgCode = activeObj.svgCode;
              }
              if (activeObj.isSvgIcon) {
                cloned.isSvgIcon = activeObj.isSvgIcon;
              }
              if (activeObj.url) {
                cloned.url = activeObj.url;
              }
              if (activeObj.name) {
                cloned.name = activeObj.name;
              }
              if (activeObj.hoverCursor) {
                cloned.hoverCursor = activeObj.hoverCursor;
              }
              if (activeObj.buttonData) {
                cloned.buttonData = activeObj.buttonData;
              }
              if (activeObj.linkData) {
                cloned.linkData = activeObj.linkData;
              }
              if (activeObj.elementType === 'socialIcon') {
                // Ensure social icon properties are preserved
                cloned.elementType = 'socialIcon';
                cloned.hoverCursor = 'pointer';
              }
              canvas._clipboard = cloned;
            });
          }
          console.warn('Object copied');
          return;
        }

        if (isCtrl && event.code === 'KeyV') {
          // Ctrl+V: Paste
          if (canvas._clipboard) {
            canvas._clipboard.clone((clonedObj: any) => {
              canvas.discardActiveObject();

              // Preserve all custom properties from the clipboard
              if (canvas._clipboard.elementType) {
                clonedObj.elementType = canvas._clipboard.elementType;
              }
              if (canvas._clipboard.svgCode) {
                clonedObj.svgCode = canvas._clipboard.svgCode;
              }
              if (canvas._clipboard.isSvgIcon) {
                clonedObj.isSvgIcon = canvas._clipboard.isSvgIcon;
              }
              if (canvas._clipboard.url) {
                clonedObj.url = canvas._clipboard.url;
              }
              if (canvas._clipboard.name) {
                clonedObj.name = canvas._clipboard.name;
              }
              if (canvas._clipboard.hoverCursor) {
                clonedObj.hoverCursor = canvas._clipboard.hoverCursor;
              }
              if (canvas._clipboard.buttonData) {
                clonedObj.buttonData = canvas._clipboard.buttonData;
              }
              if (canvas._clipboard.linkData) {
                clonedObj.linkData = canvas._clipboard.linkData;
              }

              // Set position and ensure the object is interactive
              clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
                selectable: true,
              });

              if (clonedObj.type === 'activeSelection') {
                clonedObj.canvas = canvas;
                clonedObj.forEachObject((obj: any) => {
                  canvas.add(obj);
                });
                clonedObj.setCoords();
              } else {
                canvas.add(clonedObj);
              }

              // Update clipboard position for next paste
              canvas._clipboard.top += 10;
              canvas._clipboard.left += 10;

              // Select the newly pasted object
              canvas.setActiveObject(clonedObj);
              canvas.requestRenderAll();
            });
          }
          console.warn('Object pasted');
          return;
        }

        if (event.code === 'Delete' || event.code === 'Backspace') {
          // Delete/Backspace: Delete selected object (only when not editing text)
          event.preventDefault();
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
            if (activeObject.type === 'activeSelection') {
              activeObject.forEachObject((obj: any) => {
                canvas.remove(obj);
              });
            } else {
              canvas.remove(activeObject);
            }
            canvas.discardActiveObject();
            canvas.requestRenderAll();
          }
          console.warn('Object deleted');
          return;
        }

        // Object Movement (Arrow Keys)
        const moveDistance = isShift ? 10 : 1;

        if (event.code === 'ArrowUp') {
          event.preventDefault();
          selectedObject.set('top', selectedObject.top - moveDistance);
          canvas.requestRenderAll();
          return;
        }

        if (event.code === 'ArrowDown') {
          event.preventDefault();
          selectedObject.set('top', selectedObject.top + moveDistance);
          canvas.requestRenderAll();
          return;
        }

        if (event.code === 'ArrowLeft') {
          event.preventDefault();
          selectedObject.set('left', selectedObject.left - moveDistance);
          canvas.requestRenderAll();
          return;
        }

        if (event.code === 'ArrowRight') {
          event.preventDefault();
          selectedObject.set('left', selectedObject.left + moveDistance);
          canvas.requestRenderAll();
          return;
        }
      }

      // Global Shortcuts
      if (isCtrl && event.code === 'KeyA') {
        // Ctrl+A: Select All
        event.preventDefault();
        const objects = canvas.getObjects();
        if (objects.length > 1) {
          const selection = new fabric.ActiveSelection(objects, {
            canvas,
          });
          canvas.setActiveObject(selection);
          canvas.requestRenderAll();
        } else if (objects.length === 1) {
          canvas.setActiveObject(objects[0]);
          canvas.requestRenderAll();
        }
        console.warn('Select all triggered');
        return;
      }

      // Quick Template Loading (Ctrl+1, Ctrl+2, Ctrl+3)
      if (isCtrl && event.code >= 'Digit1' && event.code <= 'Digit9') {
        event.preventDefault();
        const templateIndex = Number.parseInt(event.code.replace('Digit', ''), 10) - 1;
        if (templates[templateIndex]) {
          const template = templates[templateIndex];
          if (template && template.canvas_data) {
            const success = safeLoadFromJSON(canvas, template.canvas_data, (_loadedCanvas: any, error: any) => {
              if (error) {
                console.error('Error loading quick template:', error);
                return;
              }

              try {
                // Normalize text objects to ensure they don't have scaling issues
                normalizeTextObjects(canvas);

                // Use safe render all
                const renderSuccess = safeRenderAll(canvas);
                if (renderSuccess) {
                  console.warn('Quick template loaded:', template.name);
                } else {
                  console.warn('Quick template loaded but rendering failed:', template.name);
                }
              } catch (renderError) {
                console.error('Error rendering quick template:', renderError);
              }
            });

            if (!success) {
              console.error('Failed to initiate quick template loading');
            }
          }
        }
      }

      // Undo/Redo shortcuts
      if (isCtrl && event.code === 'KeyZ' && !isShift) {
        // Ctrl+Z: Undo
        if (onUndo && canUndo) {
          onUndo();
          console.warn('Undo triggered via keyboard shortcut');
        }
        return;
      }

      if ((isCtrl && event.code === 'KeyY') || (isCtrl && isShift && event.code === 'KeyZ')) {
        // Ctrl+Y or Ctrl+Shift+Z: Redo
        if (onRedo && canRedo) {
          onRedo();
          console.warn('Redo triggered via keyboard shortcut');
        }
      }
    } catch (error) {
      console.error('Error in keyboard shortcut handler:', error);
    }
  }, [canvas, fabric, selectedObject, templates, onShowSaveDialog, onShowLoadDialog, onUndo, onRedo, canUndo, canRedo, disableShortcuts]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
