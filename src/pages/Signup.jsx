import { useState } from 'react';
import { supabase } from '../auth/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    setLoading(false);

    if (error) setError(error.message);
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Navbar WITHOUT logout */}
      <Navbar showLogout={false} />

      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <form
          onSubmit={handleSignup}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg
                     shadow w-96 text-gray-900 dark:text-white"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            Create Account
          </h2>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 mb-3 rounded dark:text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-3 rounded dark:text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-4 rounded dark:text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <Link to="/" className="text-blue-600 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
