import { useState } from 'react';
import api from '../api/axios';

export default function FileItem({ file }) {
  const [starred, setStarred] = useState(file.starred);

  const toggleStar = async () => {
    if (starred) {
      await api.delete('/api/stars', {
        data: { resourceType: 'file', resourceId: file.id },
      });
    } else {
      await api.post('/api/stars', {
        resourceType: 'file',
        resourceId: file.id,
      });
    }
    setStarred(!starred);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
      <span>📄 {file.name}</span>

      <button onClick={toggleStar}>
        {starred ? '⭐' : '☆'}
      </button>
    </div>
  );
}
