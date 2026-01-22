import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';

export default function FilePreviewModal({ file, onClose }) {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  const containerRef = useRef(null);

  /* ---------------- LOAD SIGNED URL ---------------- */
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await api.get(`/api/files/${file.id}/preview`);
        if (mounted) setUrl(res.data.url);
      } catch (err) {
        console.error('Preview error:', err);
        if (mounted) setError('Preview unavailable');
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [file.id]);

  /* ---------------- FULLSCREEN ---------------- */
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  /* ---------------- FILE TYPE ---------------- */
  const type = file.mime_type || '';
  const isImage = type.startsWith('image/');
  const isPdf = type === 'application/pdf';
  const isVideo = type.startsWith('video/');
  const isAudio = type.startsWith('audio/');

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div
        ref={containerRef}
        className="bg-white dark:bg-gray-900 w-[92%] h-[92%] rounded shadow-lg flex flex-col"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-medium truncate">{file.name}</span>

          <div className="flex gap-2">
            <button onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}>➕</button>
            <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.4))}>➖</button>
            <button onClick={toggleFullscreen}>
              {fullscreen ? '🡼' : '⛶'}
            </button>

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                ⬇
              </a>
            )}

            <button onClick={onClose}>✕</button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto flex items-center justify-center">
          {!url && !error && <p>Loading preview…</p>}
          {error && <p className="text-red-500">{error}</p>}

          {url && isImage && (
            <img
              src={url}
              alt={file.name}
              style={{ transform: `scale(${zoom})` }}
              className="transition-transform origin-center"
            />
          )}

          {url && isPdf && (
            <iframe
              src={url}
              title="PDF Preview"
              style={{ transform: `scale(${zoom})` }}
              className="w-full h-full origin-top"
            />
          )}

          {url && isVideo && (
            <video src={url} controls className="max-h-full max-w-full" />
          )}

          {url && isAudio && <audio src={url} controls />}

          {url && !isImage && !isPdf && !isVideo && !isAudio && (
            <p>
              Preview not supported.{' '}
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="underline text-blue-600"
              >
                Download file
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
