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
      <Link
        to={to}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          active
            ? 'bg-[#1a1f2e] text-white shadow-sm'
            : 'text-[#4b5563] hover:text-[#1a1f2e] hover:bg-gray-100 hover:scale-[1.05]'
        }`}
      >
        <Icon size={15} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between sticky top-0 z-50">

      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white">
          <img
            src="/logo.jpeg"
            alt="HUDRA"
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <span className="font-bold text-[#1a1f2e] text-lg tracking-tight group-hover:tracking-wide transition-all">
          HUDRA
        </span>
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
            className="flex items-center gap-1.5 ml-2 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white text-sm font-bold justify-center hover:scale-110 transition-all"
          >
            {(user.first_name || user.username || 'U')[0].toUpperCase()}
          </button>

          <ChevronDown size={14} className="text-gray-400" />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-600 hover:text-[#1a1f2e] transition">
            Log in
          </Link>

          <Link
            to="/register"
            className="text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-4 py-1.5 rounded-lg hover:scale-105 transition-all shadow-sm"
          >
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
}