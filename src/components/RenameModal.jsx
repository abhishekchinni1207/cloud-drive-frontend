import { useEffect, useState } from 'react';

export default function RenameModal({ item, type, onSave, onClose }) {
  const [value, setValue] = useState('');

  // ✅ Always sync name safely
  useEffect(() => {
    if (item?.name) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(item.name);
    }
  }, [item]);

  const handleSave = () => {
    if (!value.trim()) return;

    onSave({
      id: item.id,
      type,
      name: value.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-4 rounded w-80 shadow-lg">
        <h3 className="font-semibold mb-3">Rename</h3>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3 dark:bg-gray-800"
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
