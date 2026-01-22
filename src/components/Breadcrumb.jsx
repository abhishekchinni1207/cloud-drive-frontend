import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Breadcrumb() {
  const { folderId } = useParams();
  const [path, setPath] = useState([]);

  useEffect(() => {
    let ignore = false; // prevents state update after unmount

    async function loadPath() {
      // Root folder → clear breadcrumbs
      if (!folderId) {
        if (!ignore) setPath([]);
        return;
      }

      try {
        const res = await api.get(`/api/folders/path/${folderId}`);
        if (!ignore) setPath(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadPath();

    return () => {
      ignore = true;
    };
  }, [folderId]);

  return (
    <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
      <Link to="/dashboard" className="text-blue-600 hover:underline">
        My Drive
      </Link>

      {path.map((folder) => (
        <span key={folder.id}>
          {' '} &gt;{' '}
          <Link
            to={`/dashboard/${folder.id}`}
            className="text-blue-600 hover:underline"
          >
            {folder.name}
          </Link>
        </span>
      ))}
    </div>
  );
}
