import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/search', {
          params: { q: query },
        });
        setResults(res.data);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="relative w-full max-w-xl">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search in Drive"
        className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring"
      />

      {/* DROPDOWN */}
      {results && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-900 rounded shadow border max-h-80 overflow-auto">
          {/* FILES */}
          {results.files?.map((file) => (
            <div
              key={file.id}
              onClick={() => {
                setResults(null);
                setQuery('');
                // open preview instead of download
                navigate(`/dashboard?preview=${file.id}`);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              📄 {file.name}
            </div>
          ))}

          {/* FOLDERS */}
          {results.folders?.map((folder) => (
            <div
              key={folder.id}
              onClick={() => {
                setResults(null);
                setQuery('');
                navigate(`/dashboard/${folder.id}`);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              📁 {folder.name}
            </div>
          ))}

          {!loading &&
            results.files.length === 0 &&
            results.folders.length === 0 && (
              <div className="px-4 py-2 text-gray-500">
                No results found
              </div>
            )}
        </div>
      )}
    </div>
  );
}
