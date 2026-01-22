import { useEffect, useState } from 'react';
import api from '../api/axios';
import FilePreviewModal from '../components/FilePreviewModal';
import ContextMenu from './ContextMenu';

export default function Recent() {
  const [data, setData] = useState({ files: [], folders: [] });
  const [loading, setLoading] = useState(true);
    const [previewFile, setPreviewFile] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);


  useEffect(() => {
    api.get('/api/recent')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

const openFile = (file) => {
  setPreviewFile(file);
};





  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Recent</h2>

      <div className="space-y-3">
        {data.folders.map((folder) => (
          <div key={folder.id} className="p-2 rounded hover:bg-gray-200">
            📁 {folder.name}
          </div>
        ))}

        {data.files.map((file) => (
          <div key={file.id} className="p-2 rounded hover:bg-gray-200"
            onDoubleClick={() => 
        openFile(file)
            }

        onContextMenu={(e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item: file,
    });
  }}
  
          >
            📄 {file.name}
          </div>
        ))}

        {data.files.length === 0 &&
          data.folders.length === 0 && (
            <p className="text-gray-500">No recent activity</p>
          )}

          {previewFile && (
  <FilePreviewModal
    file={previewFile}
    onClose={() => setPreviewFile(null)}
  />
)}

{contextMenu && (
  <ContextMenu
    x={contextMenu.x}
    y={contextMenu.y}
    onClose={() => setContextMenu(null)}
    options={[
      {
        label: 'Open',
        onClick: () => {
          openFile(contextMenu.item);
          setContextMenu(null);
        },
      },
      {
        label: 'Download',
        onClick: async () => {
          const res = await api.get(
            `/api/files/${contextMenu.item.id}/download`
          );
          window.open(res.data.url, '_blank');
          setContextMenu(null);
        },
      },
      {
        label: 'Star',
        onClick: async () => {
          await api.post('/api/stars', {
            resourceType: 'file',
            resourceId: contextMenu.item.id,
          });
          setContextMenu(null);
        },
      },
    ]}
  />
)}


      </div>
    </div>
  );
}
