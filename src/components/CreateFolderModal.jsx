import { useState } from 'react';
import api from '../api/axios';

export default function CreateFolderModal({ parentId, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const createFolder = async () => {
    if (!name.trim()) return;

    setLoading(true);
    await api.post('/api/folders', {
      name,
      parentId: parentId ?? null,
    });
    setLoading(false);

    onCreated(); // refresh dashboard
    onClose();   // close modal
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded w-96">
        <h3 className="font-semibold mb-4">New Folder</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Folder name"
          className="w-full border p-2 rounded mb-4 dark:bg-gray-800"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={createFolder}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
