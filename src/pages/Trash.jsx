import { useEffect, useState } from 'react';
import api from '../api/axios';
import EmptyState from '../components/EmptyState';

export default function Trash() {
  const [trash, setTrash] = useState({ files: [], folders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/trash')
      .then((res) => setTrash(res.data))
      .finally(() => setLoading(false));
  }, []);

  // ♻️ Restore (file or folder)
  const restoreItem = async (type, id) => {
    await api.post('/api/trash/restore', {
      resourceType: type,
      resourceId: id,
    });

    setTrash((prev) => ({
      files:
        type === 'file'
          ? prev.files.filter((f) => f.id !== id)
          : prev.files,
      folders:
        type === 'folder'
          ? prev.folders.filter((f) => f.id !== id)
          : prev.folders,
    }));
  };

  // ❌ Delete forever (file or folder)
  const deleteForever = async (type, id) => {
    const endpoint =
      type === 'file'
        ? `/api/files/${id}?force=true`
        : `/api/folders/${id}?force=true`;

    await api.delete(endpoint);

    setTrash((prev) => ({
      files:
        type === 'file'
          ? prev.files.filter((f) => f.id !== id)
          : prev.files,
      folders:
        type === 'folder'
          ? prev.folders.filter((f) => f.id !== id)
          : prev.folders,
    }));
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  // 🧹 Empty trash state
  if (trash.files.length === 0 && trash.folders.length === 0) {
    return (
      <EmptyState
        image="/empty-trash.svg"
        title="Trash is empty"
        description="Items moved to the trash will be deleted forever after 30 days"
      />
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Trash</h2>

      {/* 📁 Folders */}
      {trash.folders.map((folder) => (
        <div
          key={folder.id}
          className="flex items-center justify-between
                     p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span>📁 {folder.name}</span>

          <div className="flex gap-3">
            <button
              onClick={() => restoreItem('folder', folder.id)}
              className="text-sm text-green-600"
            >
              Restore
            </button>

            <button
              onClick={() => deleteForever('folder', folder.id)}
              className="text-sm text-red-600"
            >
              Delete forever
            </button>
          </div>
        </div>
      ))}

      {/* 🗑 Files */}
      {trash.files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between
                     p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span>🗑 {file.name}</span>

          <div className="flex gap-3">
            <button
              onClick={() => restoreItem('file', file.id)}
              className="text-sm text-green-600"
            >
              Restore
            </button>

            <button
              onClick={() => deleteForever('file', file.id)}
              className="text-sm text-red-600"
            >
              Delete forever
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
