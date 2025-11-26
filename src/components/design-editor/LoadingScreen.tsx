export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-gray-600">Loading design...</p>
      </div>
    </div>
  );
}
