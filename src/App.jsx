import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Starred from './pages/Starred';
import Trash from './pages/Trash';
import Layout from './components/Layout';
import Recent from './components/Recent';

export default function App() {
  return (
    <BrowserRouter>
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:folderId" element={<Dashboard />} />
          <Route path="/recent" element={<Recent />} />

          <Route path="/starred" element={<Starred />} />
          <Route path="/trash" element={<Trash />} />
        </Route>
      </Routes>
      </div>
    </BrowserRouter>
  );
}
