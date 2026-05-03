import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/api/users/register/', form);
      await login(form.username, form.password);
      navigate('/browse');
    } catch (err) {
      const msg = err.response?.data?.error;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <div>
      <label className="text-sm text-slate-400 mb-1 block">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={e => setForm({...form, [name]: e.target.value})}
        className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#1DB954]"
        placeholder={placeholder}
        required={['username','email','password'].includes(name)}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-10">
      <div className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-md border border-[#334155]">
        <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
        <p className="text-slate-400 text-sm mb-6">Join HUDRA — post or do tasks locally</p>

        {error && <div className="bg-red-500/10 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {field('first_name', 'First name', 'text', 'John')}
            {field('last_name', 'Last name', 'text', 'Doe')}
          </div>
          {field('username', 'Username', 'text', 'john_doe')}
          {field('email', 'Email', 'email', 'john@example.com')}
          {field('password', 'Password', 'password', '••••••••')}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1DB954] text-black font-semibold py-2.5 rounded-lg hover:bg-green-400 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1DB954] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}