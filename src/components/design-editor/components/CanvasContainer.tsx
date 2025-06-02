type CanvasContainerProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isCanvasReady: boolean;
  fabricError: string | null;
  canvas: any;
  fabric: any;
};

export function CanvasContainer({
  canvasRef,
  containerRef,
  isCanvasReady: _isCanvasReady,
  fabricError: _fabricError,
  canvas: _canvas,
  fabric: _fabric,
}: CanvasContainerProps) {
  return (
    <div
      ref={containerRef}
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-gray-50 p-4"
    >
      <div className="relative max-h-full max-w-full">

        {/* Keyboard Shortcuts Help */}
        <div className="pointer-events-none absolute bottom-4 right-4 z-10 rounded bg-black/80 p-3 text-xs text-white opacity-0 transition-opacity hover:pointer-events-auto hover:opacity-100">
          <div className="space-y-1">
            <div className="mb-2 font-semibold">Keyboard Shortcuts</div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Ctrl+Shift+S</kbd>
              {' '}
              Save Template
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Ctrl+O</kbd>
              {' '}
              Load Template
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Ctrl+C/V/X</kbd>
              {' '}
              Copy/Paste/Cut
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Del</kbd>
              {' '}
              Delete
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Ctrl+A</kbd>
              {' '}
              Select All
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Arrows</kbd>
              {' '}
              Move (+Shift: 10px)
            </div>
            <div>
              <kbd className="rounded bg-gray-700 px-1">Ctrl+1-9</kbd>
              {' '}
              Quick Load Template
            </div>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="border border-gray-300 shadow-lg"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}
