import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Sparkles, PawPrint, PartyPopper, Wrench, Package, Monitor, ShoppingBag, Leaf, MoreHorizontal, ArrowRight } from 'lucide-react';
import API from '../api';
import { useEffect } from 'react';

const CATEGORIES = [
  { key: 'moving', label: 'Moving', icon: Truck },
  { key: 'cleaning', label: 'Cleaning', icon: Sparkles },
  { key: 'pet_care', label: 'Pet Care', icon: PawPrint },
  { key: 'event_help', label: 'Event Help', icon: PartyPopper },
  { key: 'handyman', label: 'Handyman', icon: Wrench },
  { key: 'delivery', label: 'Delivery', icon: Package },
  { key: 'tech_setup', label: 'Tech Help', icon: Monitor },
  { key: 'errands', label: 'Errands', icon: ShoppingBag },
  { key: 'gardening', label: 'Gardening', icon: Leaf },
  { key: 'other', label: 'Other', icon: MoreHorizontal },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get('/api/tasks/').then(res => setTasks(res.data.slice(0, 6)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#1a1f2e] text-white text-center py-24 px-4">
        <h1 className="text-5xl font-bold mb-4 leading-tight">Professional Task<br />Marketplace</h1>
        <p className="text-gray-300 text-lg mb-10">Post tasks, hire verified professionals, and handle payments securely.<br />Your trusted platform for getting work done.</p>
        <div className="max-w-2xl mx-auto flex gap-0 bg-white rounded-2xl overflow-hidden shadow-lg">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate(`/browse?q=${search}`)}
            placeholder="What do you need help with?"
            className="flex-1 px-5 py-4 text-gray-800 text-base outline-none"
          />
          <button
            onClick={() => navigate(`/browse?q=${search}`)}
            className="bg-[#1a1f2e] text-white px-8 py-4 font-semibold hover:bg-[#2d3548] transition"
          >
            Search
          </button>
        </div>
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/post-task" className="bg-white text-[#1a1f2e] font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition flex items-center gap-2">
            Post a Task <ArrowRight size={16} />
          </Link>
          <Link to="/browse" className="border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition">
            Browse Tasks
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Categories */}
        <div className="grid grid-cols-5 gap-4 mb-16">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => navigate(`/browse?category=${key}`)}
              className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-[#6366f1] hover:shadow-md transition group"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-[#ede9fe] transition">
                <Icon size={22} className="text-gray-600 group-hover:text-[#6366f1] transition" />
              </div>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </button>
          ))}
        </div>

        {/* Available Tasks */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1a1f2e]">Available Tasks</h2>
          <Link to="/browse" className="text-gray-500 hover:text-[#1a1f2e] text-sm flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="mb-4">No tasks yet.</p>
            <Link to="/post-task" className="text-[#6366f1] hover:underline">Post the first task!</Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {tasks.map(task => <TaskCard key={task.id} task={task} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  const navigate = useNavigate();
  const ICONS = { moving: '🚚', cleaning: '✨', pet_care: '🐾', event_help: '🎉', handyman: '🔧', delivery: '📦', tech_setup: '💻', errands: '🛍️', gardening: '🌿' };
  return (
    <div onClick={() => navigate(`/tasks/${task.id}`)} className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:border-gray-300 transition">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-base">{ICONS[task.category] || '📋'}</div>
          <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium capitalize">{task.status}</span>
        </div>
        <span className="font-bold text-[#1a1f2e] text-lg">${task.budget}</span>
      </div>
      <h3 className="font-bold text-[#1a1f2e] text-base mb-1">{task.title}</h3>
      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{task.description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>📍 {task.location}</span>
        {task.task_date && <span>📅 {new Date(task.task_date).toLocaleDateString('en', {month:'short',day:'numeric'})}</span>}
        {task.applicant_count > 0 && <span>👥 {task.applicant_count} applied</span>}
      </div>
    </div>
  );
}
