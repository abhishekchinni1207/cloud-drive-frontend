import { useRef, useState } from 'react';
import api from '../api/axios';
import UploadToast from './UploadToast';

export default function UploadButton({ folderId, onUploaded }) {
  const controllerRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);

  const startTimeRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);

    controllerRef.current = new AbortController();
    startTimeRef.current = Date.now();

    setUploading(true);
    setProgress(0);
    setFileName(file.name);
    setTimeLeft(null);

    try {
      await api.post('/api/files/upload', formData, {
        signal: controllerRef.current.signal,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          if (!e.total) return;

          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);

          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const speed = e.loaded / elapsed;
          const remaining = e.total - e.loaded;

          if (speed > 0) {
            setTimeLeft(`${Math.ceil(remaining / speed)}s`);
          }
        },
      });

      onUploaded?.();
    } catch (err) {
      if (err.name === 'CanceledError') {
        console.log('Upload cancelled');
      } else {
        console.error('Upload failed', err);
        alert('Upload failed');
      }
    } 
      finally {
  setTimeout(() => {
    setUploading(false);
    setProgress(0);
    setTimeLeft(null);
  }, 500); // let user see "Saving file…"


    }
  };

  const cancelUpload = () => {
    controllerRef.current?.abort();
    setUploading(false);
  };

  return (
    <>
      <label className="cursor-pointer bg-gray-200 px-3 py-1 rounded text-sm w-full
        hover:bg-gray-300
        dark:bg-gray-800 dark:hover:bg-gray-700
        flex justify-center items-center
      ">
        Upload File
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      {uploading && (
        <UploadToast
          fileName={fileName}
    progress={progress}
    timeLeft={timeLeft}
    uploading={uploading}
    onCancel={cancelUpload}
        />
      )}
    </>
  );
}
