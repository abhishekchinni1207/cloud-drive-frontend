export default function BulkActionBar({
  count,
  onStar,
  onUnstar,
  onMove,
  onTrash,
  onClear,
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2
      bg-gray-900 text-white px-4 py-2 rounded-xl shadow-lg
      flex gap-3 items-center z-50">

      <span className="text-sm">{count} selected</span>

      <button onClick={onStar}>⭐ Star</button>
      <button onClick={onUnstar}>☆ Unstar</button>
      <button onClick={onMove}>📦 Move</button>
      <button onClick={onTrash}>🗑 Trash</button>

      <button
        onClick={onClear}
        className="text-red-400"
      >
        ✕
      </button>
    </div>
  );
}
