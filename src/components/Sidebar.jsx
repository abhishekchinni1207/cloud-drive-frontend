
import { useState } from 'react';
import { Link, useParams} from 'react-router-dom';
import UploadButton from './UploadButton';
import CreateFolderModal from './CreateFolderModal';

export default function Sidebar() {
  const { folderId } = useParams();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <aside className="h-full p-4 space-y-6
      bg-gray-100 text-gray-900
      dark:bg-gray-900 dark:text-gray-100">

      {/* ACTIONS */}
      <div className="space-y-2 ">
        <>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={() => setShowCreate(true)}
        >
          + New Folder
        </button>

        <UploadButton  folderId={folderId} />


         {showCreate && (
          <CreateFolderModal
          parentId={folderId}
            onClose={() => setShowCreate(false)}
          />
        )}
        </> 
      </div>

      <hr className="border-gray-300 dark:border-gray-700" />

      {/* NAVIGATION */}
      <nav className="space-y-3">
        <Link to="/dashboard" className="block hover:text-blue-500">
          📁 My Drive
        </Link>
        <Link to="/recent" className="block hover:text-blue-500">
          🕒 Recent
        </Link>
        <Link to="/starred" className="block hover:text-blue-500">
          ⭐ Starred
        </Link>
        <Link to="/trash" className="block hover:text-blue-500">
          🗑 Trash
        </Link>
      </nav>
    </aside>
  );
}
