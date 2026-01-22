import { useEffect, useState } from 'react';
import api from '../api/axios';
import EmptyState from '../components/EmptyState';

export default function Starred() {
  const [data, setData] = useState({ files: [], folders: [] });

  useEffect(() => {
    api.get('/api/stars').then(res => setData(res.data));
  }, []);

  if (data.files.length === 0 && data.folders.length === 0) {
    return (
      <EmptyState
        image="/empty-starred.svg"
        title="No starred files"
        description="Add stars to files and folders to find them here"
      />
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Starred</h2>

      {data.folders.map(f => (
        <div key={f.id}>⭐ 📁 {f.name}</div>
      ))}

      {data.files.map(f => (
        <div key={f.id}>⭐ 📄 {f.name}</div>
      ))}
    </div>
  );
}
