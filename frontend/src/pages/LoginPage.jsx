import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // Backend authController expects 'username' field which can be email or username
      const response = await api.post('/auth/login', { username: username, password });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));

      if (response.data.data.role === 'admin') {
        navigate('/app/dashboard');
      } else {
        navigate('/app/user-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-2xl shadow-2xl text-center border border-slate-700">
        <div className="flex justify-center">
          <svg className="h-10 w-auto text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white">SUPPLYSENSEAI</h2>
        <p className="text-slate-400">Material Demand Forecasting System</p>

        {location.state?.message && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
            <p className="text-sm text-green-400">{location.state.message}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              name="username"
              type="email"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(''); // Clear error when user starts typing
              }}
              className="relative block w-full px-4 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(''); // Clear error when user starts typing
              }}
              className="relative block w-full px-4 py-3 bg-slate-700 border border-slate-600 placeholder-slate-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-slate-900 bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 transition-colors duration-300"
          >
            Sign in
          </button>

          <p className="text-sm text-slate-500 mt-4">
            Don't have an account? <Link to="/signup" className="text-teal-400 hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div >
  );
};

export default LoginPage;

