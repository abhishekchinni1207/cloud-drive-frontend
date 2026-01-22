
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
import SearchBar from './SearchBar';

import { Outlet } from 'react-router-dom';

export default function Layout() {

  return (
    <div className="min-h-screen flex flex-col
      bg-gray-100 text-gray-900
      dark:bg-gray-950 dark:text-gray-100">

      {/* NAVBAR */}
      <Navbar showLogout={true} />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-64 shrink-0 border-r
          border-gray-200 dark:border-gray-800">
          <Sidebar />

        </aside>

        {/* MAIN AREA */}
        <div className="flex flex-col flex-1">

          {/* TOP BAR */}
          <div className="border-b px-4 py-2 flex flex-col gap-2">
             <SearchBar />
        
            <Breadcrumb />
          </div>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-auto p-4">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}
