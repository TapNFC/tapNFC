import { Redo, RotateCcw, RotateCw, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ToolbarActionsProps = {
  onUndo?: () => void;
  onRedo?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
};

export function ToolbarActions({
  onUndo,
  onRedo,
  onRotateLeft,
  onRotateRight,
  canUndo = false,
  canRedo = false,
}: ToolbarActionsProps) {
  return (
    <>
      <div className="h-6 w-px bg-white/20" />

      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 hover:bg-white/10  hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onUndo}
          title="Undo (Ctrl+Z)"
          disabled={!canUndo}
        >
          <Undo className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0  hover:bg-white/10 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onRedo}
          title="Redo (Ctrl+Y)"
          disabled={!canRedo}
        >
          <Redo className="size-4" />
        </Button>
      </div>

      <div className="h-6 w-px bg-white/20" />

      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0  hover:bg-white/10 hover:text-black"
          onClick={onRotateLeft}
          title="Rotate Left"
        >
          <RotateCcw className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 hover:bg-white/10 hover:text-black"
          onClick={onRotateRight}
          title="Rotate Right"
        >
          <RotateCw className="size-4" />
        </Button>
      </div>

    </>
  );
}
