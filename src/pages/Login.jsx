import { useState } from 'react';
import { supabase } from '../auth/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) setError(error.message);
    else navigate('/dashboard');
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Navbar WITHOUT logout */}
      <Navbar showLogout={false} />

      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-96
                        text-gray-900 dark:text-white shadow">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Login to Cloud Drive
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full border rounded-lg p-3 dark:text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg p-3 dark:text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700
                         text-white py-3 rounded-lg"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full border py-3 rounded-lg
                       hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Continue with Google
          </button>

          <p className="text-sm text-center mt-6">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
