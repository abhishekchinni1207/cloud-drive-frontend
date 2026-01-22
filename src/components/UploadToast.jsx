export default function UploadToast({
  fileName,
  progress,
  timeLeft,
  onCancel,
}) {
  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-gray-900
                    shadow-lg rounded-lg p-4 border z-50">
      <div className="text-sm font-medium mb-1">
        Uploading 1 item
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
        {fileName}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded mt-2 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-2 text-xs">
        <span className="text-gray-500">
          {progress < 100
            ? timeLeft
              ? `${timeLeft} left`
              : 'Uploading...'
            : 'Saving file…'}
        </span>

        <button
          onClick={onCancel}
          className="text-blue-600 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
