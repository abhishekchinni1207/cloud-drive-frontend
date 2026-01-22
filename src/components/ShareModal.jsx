import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ShareModal({ item, onClose }) {
  const [permission, setPermission] = useState('viewer');
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchLink = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/api/files/${item.id}/download`
        );

        if (mounted) {
          setLink(res.data.url);
        }
      } catch (err) {
        console.error('Share link error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLink();

    return () => {
      mounted = false;
    };
  }, [item.id]);

  const copyLink = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-5 rounded w-[420px]">
        {/* HEADER */}
        <h3 className="text-lg font-semibold mb-2">
          Share “{item.name}”
        </h3>

        {/* LINK ACCESS */}
        <div className="border rounded p-3 mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Anyone with the link
          </p>

          <div className="flex justify-between items-center gap-2">
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>

            <button
              onClick={copyLink}
              disabled={!link}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        </div>

        {/* LINK PREVIEW */}
        <input
          value={loading ? 'Generating link…' : link}
          readOnly
          className="w-full text-sm border rounded px-2 py-1 mb-4"
        />

        {/* FOOTER */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
