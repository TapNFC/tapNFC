type PreviewInfoProps = {
  width: number;
  height: number;
  scale: number;
};

export function PreviewInfo({ width, height, scale }: PreviewInfoProps) {
  return (
    <div className="rounded-b-lg bg-gray-50 p-2 text-xs text-gray-500">
      <div className="flex items-center justify-between">
        <span>
          {Math.round(width)}
          {' '}
          ×
          {Math.round(height)}
          px
        </span>
        <span>
          Scale:
          {Math.round(scale * 100)}
          %
        </span>
      </div>
    </div>
  );
}
