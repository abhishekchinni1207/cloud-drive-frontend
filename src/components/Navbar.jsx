import { useEffect, useState } from 'react';
import { supabase } from '../auth/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ showLogout = false }) {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains('dark')
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="h-14 flex items-center justify-between px-6
      bg-white text-gray-900
      dark:bg-gray-900 dark:text-white
      border-b border-gray-200 dark:border-gray-700">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl">☁️</span>
        <span className="font-semibold">Cloud Drive</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
        >
          {dark ? 'Light' : 'Dark'}
        </button>

        {/* ✅ Logout ONLY if allowed */}
        {showLogout && (
          <button
            onClick={logout}
            className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
