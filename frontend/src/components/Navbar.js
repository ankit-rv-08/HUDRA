import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusCircle, List, Wallet, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#1e293b] border-b border-[#334155] px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-[#1DB954] tracking-tight">
        HUDRA
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <Link to="/browse" className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition">
            <List size={16} /> Browse
          </Link>
          <Link to="/post-task" className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition">
            <PlusCircle size={16} /> Post Task
          </Link>
          <Link to="/messages" className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition">
            <MessageSquare size={16} /> Messages
          </Link>
          <Link to="/wallet" className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition">
            <Wallet size={16} /> Wallet
          </Link>
          <Link to="/dashboard" className="text-sm text-slate-300 hover:text-white transition">
            {user.first_name || user.username}
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition">
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-300 hover:text-white transition">Log in</Link>
          <Link to="/register" className="text-sm bg-[#1DB954] text-black font-semibold px-4 py-1.5 rounded-full hover:bg-green-400 transition">
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
}