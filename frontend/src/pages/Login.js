import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.username, form.password);
      navigate('/home');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10";

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[#1a1f2e] rounded-lg flex items-center justify-center text-white font-bold text-sm">H</div>
          <span className="font-bold text-[#1a1f2e]">HUDRA</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1f2e] mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Log in to your HUDRA account</p>
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl mb-4 border border-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Username</label>
            <input type="text" className={inp} placeholder="your_username" value={form.username}
              onChange={e => setForm({...form, username: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
            <input type="password" className={inp} placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required autoComplete="current-password" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#6366f1] text-white font-semibold py-3 rounded-xl hover:bg-[#5558e3] transition disabled:opacity-50">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#6366f1] hover:underline font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
