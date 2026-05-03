import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, PlusCircle, MessageSquare, LayoutDashboard, Wallet, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const NavLink = ({ to, icon: Icon, label }) => {
    const active = path === to || path.startsWith(to + '/');
    return (
      <Link to={to} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        active ? 'bg-[#1a1f2e] text-white' : 'text-[#4b5563] hover:text-[#1a1f2e]'
      }`}>
        <Icon size={15} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-[#1a1f2e] rounded-lg flex items-center justify-center text-white font-bold text-lg">H</div>
        <span className="font-bold text-[#1a1f2e] text-lg tracking-tight">HUDRA</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-1">
          <NavLink to="/home" icon={Home} label="Home" />
          <NavLink to="/browse" icon={Search} label="Browse Tasks" />
          <NavLink to="/post-task" icon={PlusCircle} label="Post Task" />
          <NavLink to="/messages" icon={MessageSquare} label="Messages" />
          <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavLink to="/wallet" icon={Wallet} label="Wallet" />
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 ml-2 w-8 h-8 bg-[#6366f1] rounded-full text-white text-sm font-bold justify-center"
          >
            {(user.first_name || user.username || 'U')[0].toUpperCase()}
          </button>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-600 hover:text-[#1a1f2e] transition">Log in</Link>
          <Link to="/register" className="text-sm bg-[#6366f1] text-white font-semibold px-4 py-1.5 rounded-lg hover:bg-[#5558e3] transition">
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
}
