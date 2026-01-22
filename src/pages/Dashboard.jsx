import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import api from '../api/axios';

import ContextMenu from '../components/ContextMenu';
import CreateFolderModal from '../components/CreateFolderModal';
import RenameModal from '../components/RenameModal';
import UploadButton from '../components/UploadButton';
import MoveModal from '../components/MoveModal';
import BulkActionBar from '../components/BulkActionBar';
import FilePreviewModal from '../components/FilePreviewModal';
import ShareModal from '../components/ShareModal';


export default function Dashboard() {
  const { folderId } = useParams();
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [data, setData] = useState({ folders: [], files: [] });
  const [starred, setStarred] = useState({ folders: [], files: [] });
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastSelected, setLastSelected] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [renameItem, setRenameItem] = useState(null);
  const [moveItem, setMoveItem] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareItem, setShareItem] = useState(null);





  /* ---------------- DERIVED LIST (FOR RANGE SELECT) ---------------- */
  const unifiedList = useMemo(
    () => [
      ...data.folders.map((f) => ({ ...f, type: 'folder' })),
      ...data.files.map((f) => ({ ...f, type: 'file' })),
    ],
    [data.folders, data.files]
  );

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const id = folderId ?? 'root';

    api
      .get(`/api/folders/${id}`)
      .then((res) => {
        setData({
          folders: res.data?.folders ?? [],
          files: res.data?.files ?? [],
        });
      })
      .finally(() => setLoading(false));
  }, [folderId, reloadKey]);

  /* ---------------- LOAD STARS ---------------- */
  const loadStars = useCallback(() => {
    api.get('/api/stars').then((res) => {
      setStarred({
        folders: res.data?.folders?.map((f) => f.id) ?? [],
        files: res.data?.files?.map((f) => f.id) ?? [],
      });
    });
  }, []);

  useEffect(() => {
    loadStars();
  }, [loadStars]);

  /* ---------------- HELPERS ---------------- */
  const isSelected = (id, type) =>
    selectedItems.some((i) => i.id === id && i.type === type);

  const clearSelection = () => {
    setSelectedItems([]);
    setContextMenu(null);
  };

  const handleSelect = (e, item, index) => {
    e.stopPropagation();

    const isMulti = e.metaKey || e.ctrlKey;
    const isRange = e.shiftKey && lastSelected !== null;

    setSelectedItems((prev) => {
      if (isRange) {
        const start = Math.min(lastSelected.index, index);
        const end = Math.max(lastSelected.index, index);

        return unifiedList
          .slice(start, end + 1)
          .map((i) => ({ id: i.id, type: i.type }));
      }

      if (isMulti) {
        const exists = prev.some(
          (i) => i.id === item.id && i.type === item.type
        );

        return exists
          ? prev.filter(
              (i) => !(i.id === item.id && i.type === item.type)
            )
          : [...prev, { id: item.id, type: item.type }];
      }

      return [{ id: item.id, type: item.type }];
    });

    setLastSelected({ index, type: item.type });
  };

  /* ---------------- KEYBOARD ---------------- */
  const bulkTrash = useCallback(async () => {
    for (const item of selectedItems) {
      await api.delete(
        item.type === 'folder'
          ? `/api/folders/${item.id}`
          : `/api/files/${item.id}`
      );
    }
    setSelectedItems([]);
    setReloadKey((k) => k + 1);
  }, [selectedItems]);

  useEffect(() => {
    const handler = async (e) => {
      if (selectedItems.length === 0) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        setSelectedItems(
          unifiedList.map((i) => ({ id: i.id, type: i.type }))
        );
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        await bulkTrash();
      }

      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedItems, unifiedList, bulkTrash]);

  /* ---------------- ACTIONS ---------------- */
  const toggleStar = async (type, id) => {
    const isStarred =
      type === 'folder'
        ? starred.folders.includes(id)
        : starred.files.includes(id);

    if (isStarred) {
      await api.delete(
        `/api/stars?resourceType=${type}&resourceId=${id}`
      );
    } else {
      await api.post('/api/stars', {
        resourceType: type,
        resourceId: id,
      });
    }

    loadStars();
  };

  const trashItem = async (item, type) => {
    await api.delete(
      type === 'folder'
        ? `/api/folders/${item.id}`
        : `/api/files/${item.id}`
    );
    setReloadKey((k) => k + 1);
  };

  const handleRename = async ({ id, type, name }) => {
    await api.patch(
      type === 'folder'
        ? `/api/folders/${id}`
        : `/api/files/${id}`,
      { name }
    );
    setReloadKey((k) => k + 1);
  };

  const bulkStar = async () => {
    for (const item of selectedItems) {
      await api.post('/api/stars', {
        resourceType: item.type,
        resourceId: item.id,
      });
    }
    clearSelection();
    loadStars();
  };

  const bulkUnstar = async () => {
    for (const item of selectedItems) {
      await api.delete(
        `/api/stars?resourceType=${item.type}&resourceId=${item.id}`
      );
    }
    clearSelection();
    loadStars();
  };

  const openBulkMove = () => {
    setMoveItem({
      type: 'bulk',
      items: selectedItems,
    });
  };



 const foldersToRender = data.folders;
const filesToRender = data.files;


  if (loading) return <p className="p-6">Loading...</p>;

  /* ---------------- UI ---------------- */
  return (
    <>
    
    <div className="relative min-h-screen" onClick={clearSelection}>

      <h2 className="text-2xl font-semibold mb-6">Welcome To The Drive</h2>


      
    

      

      {showCreateFolder && (
        <CreateFolderModal
          parentId={folderId}
          onClose={() => setShowCreateFolder(false)}
          onCreated={() => setReloadKey((k) => k + 1)}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          options={[
                {
      label: 'Share',
      onClick: () => {
        setShareItem(contextMenu.item);
        setContextMenu(null);
      },
    },
            { label: 'Rename', onClick: () => setRenameItem(contextMenu) },
            { label: 'Move', onClick: () => setMoveItem(contextMenu) },
            {
              label: 'Move to Trash',
              onClick: () =>
                trashItem(contextMenu.item, contextMenu.type),
            },
          ]}
        />
      )}

      {renameItem && (
        <RenameModal
          item={renameItem.item}
          type={renameItem.type}
          onSave={handleRename}
          onClose={() => setRenameItem(null)}
        />
      )}

      {moveItem && (
        <MoveModal
          item={moveItem.item}
          type={moveItem.type}
          onClose={() => setMoveItem(null)}
          onMoved={() => setReloadKey((k) => k + 1)}
        />
      )}

      {shareItem && (
  <ShareModal
    item={shareItem}
    onClose={() => setShareItem(null)}
  />
)}


      {/* FOLDERS */}
      {foldersToRender.map((folder, index) => (
        <div
          key={folder.id}
          onClick={(e) =>
            handleSelect(e, { ...folder, type: 'folder' }, index)
          }
          onDoubleClick={() =>
            navigate(`/dashboard/${folder.id}`)
          }
          onContextMenu={(e) => {
            e.preventDefault();
            setSelectedItems([{ id: folder.id, type: 'folder' }]);
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
              type: 'folder',
              item: folder,
            });
          }}
          className={`flex justify-between p-2 rounded cursor-pointer ${
            isSelected(folder.id, 'folder')
              ? 'bg-blue-200 dark:bg-blue-900'
              : 'hover:bg-gray-200 dark:hover:bg-gray-800'
          }`}
        >
          📁 {folder.name}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStar('folder', folder.id);
            }}
          >
            {starred.folders.includes(folder.id) ? '⭐' : '☆'}
          </button>
        </div>
      ))}

      {/* FILES */}
      {filesToRender.map((file, index) => (
        <div
          key={file.id}
          onClick={(e) =>
            handleSelect(e, { ...file, type: 'file' }, index)
          }
          onDoubleClick={(e) => {
  e.stopPropagation();
  setPreviewFile(file);
}}

          
          onContextMenu={(e) => {
            e.preventDefault();
            setSelectedItems([{ id: file.id, type: 'file' }]);
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
              type: 'file',
              item: file,
            });
          }}
          className={`flex justify-between p-2 rounded cursor-pointer ${
            isSelected(file.id, 'file')
              ? 'bg-blue-200 dark:bg-blue-900'
              : 'hover:bg-gray-200 dark:hover:bg-gray-800'
          }`}
        >
          📄 {file.name}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStar('file', file.id);
            }}
          >
            {starred.files.includes(file.id) ? '⭐' : '☆'}
          </button>
        </div>
      ))}

      {selectedItems.length > 0 && (
        <BulkActionBar
          count={selectedItems.length}
          onStar={bulkStar}
          onUnstar={bulkUnstar}
          onMove={openBulkMove}
          onTrash={bulkTrash}
          onClear={clearSelection}
        />
      )}

      {previewFile && (
  <FilePreviewModal
    file={previewFile}
    onClose={() => setPreviewFile(null)}
  />
)}

    </div>
    </>
  );
}
