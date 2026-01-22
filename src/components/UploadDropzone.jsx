import { useState } from 'react';
import api from '../api/axios';

export default function UploadDropzone({ folderId, onUploaded }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);

    try {
      setStatus('Uploading...');
      await api.post('/api/files/upload', formData, {
        onUploadProgress: (e) => {
          const percent = Math.round(
            (e.loaded * 100) / e.total
          );
          setProgress(percent);
        },
      });

      setStatus('Upload successful ✅');
      setProgress(0);
      onUploaded();
    } catch {
      setStatus('Upload failed ❌');
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        uploadFile(e.dataTransfer.files[0]);
      }}
      className="border-2 border-dashed p-6 rounded text-center"
    >
      <p>Drag & drop file here</p>

      {progress > 0 && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-600 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
