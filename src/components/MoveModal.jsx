import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MoveModal({ item, type, onClose, onMoved }) {
  const [folders, setFolders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD ROOT FOLDERS ---------------- */
  useEffect(() => {
    api
      .get('/api/folders/root')
      .then((res) => {
        setFolders(res.data?.folders ?? []);
      })
      .catch(() => {
        setFolders([]);
      });
  }, []);

  /* ---------------- MOVE HANDLER ---------------- */
  const handleMove = async () => {
    try {
      setError('');
      setLoading(true);

      // 🔹 BULK MOVE
      if (type === 'bulk') {
        for (const entry of item.items) {
          const endpoint =
            entry.type === 'folder'
              ? `/api/folders/${entry.id}`
              : `/api/files/${entry.id}`;

          const payload =
            entry.type === 'folder'
              ? { parentId: selected }
              : { folderId: selected };

          await api.patch(endpoint, payload);
        }
      } 
      // 🔹 SINGLE MOVE
      else {
        const endpoint =
          type === 'folder'
            ? `/api/folders/${item.id}`
            : `/api/files/${item.id}`;

        const payload =
          type === 'folder'
            ? { parentId: selected }
            : { folderId: selected };

        await api.patch(endpoint, payload);
      }

      onMoved();
      onClose();
    } catch (err) {
      console.error('Move failed', err);
      setError('Move failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-4 rounded w-96">
        <h3 className="font-semibold mb-3">Move to</h3>

        <div className="max-h-60 overflow-y-auto space-y-1 border rounded p-2">
          {/* ROOT */}
          <div
            onClick={() => setSelected(null)}
            className={`p-2 rounded cursor-pointer ${
              selected === null ? 'bg-blue-100 dark:bg-gray-800' : ''
            }`}
          >
            📁 My Drive
          </div>

          {/* FOLDERS */}
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => setSelected(folder.id)}
              className={`p-2 rounded cursor-pointer ${
                selected === folder.id
                  ? 'bg-blue-100 dark:bg-gray-800'
                  : ''
              }`}
            >
              📁 {folder.name}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            onClick={handleMove}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-60"
          >
            {loading ? 'Moving...' : 'Move'}
          </button>
        </div>
      </div>
    </div>
  );
}
