import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:'', email:'', password:'', first_name:'', last_name:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/api/users/register/', form);
      await login(form.username, form.password);
      navigate('/home');
    } catch (err) {
      const msg = err.response?.data?.error;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10";

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[#1a1f2e] rounded-lg flex items-center justify-center text-white font-bold text-sm">H</div>
          <span className="font-bold text-[#1a1f2e]">HUDRA</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1f2e] mb-1">Create account</h1>
        <p className="text-gray-500 text-sm mb-6">Join HUDRA — post or do tasks locally</p>
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl mb-4 border border-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">First name</label>
              <input className={inp} placeholder="John" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Last name</label>
              <input className={inp} placeholder="Doe" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Username</label>
            <input className={inp} placeholder="john_doe" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
            <input type="email" className={inp} placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
            <input type="password" className={inp} placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required autoComplete="new-password" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#6366f1] text-white font-semibold py-3 rounded-xl hover:bg-[#5558e3] transition disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#6366f1] hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
