import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import API from '../api';

const CATEGORIES = ['all','moving','cleaning','pet_care','event_help','handyman','errands','gardening','delivery','tech_setup'];
const ICONS = { moving:'🚚', cleaning:'✨', pet_care:'🐾', event_help:'🎉', handyman:'🔧', delivery:'📦', tech_setup:'💻', errands:'🛍️', gardening:'🌿' };

export default function BrowseTasks() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState(params.get('category') || 'all');
  const [search, setSearch] = useState(params.get('q') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = category !== 'all' ? `?category=${category}` : '';
    API.get(`/api/tasks/${q}`).then(res => {
      let filtered = res.data;
      if (search) filtered = filtered.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()));
      setTasks(filtered);
    }).finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 outline-none focus:border-[#6366f1] shadow-sm"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition capitalize border ${
              category === cat ? 'bg-[#1a1f2e] text-white border-[#1a1f2e]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}>
            {cat === 'all' ? 'All' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#1a1f2e]">Available Tasks</h1>
        <span className="text-sm text-gray-400">{tasks.length} tasks</span>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>No tasks found.</p>
          <button onClick={() => navigate('/post-task')} className="mt-3 text-[#6366f1] hover:underline text-sm">Post one!</button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {tasks.map(task => (
            <div key={task.id} onClick={() => navigate(`/tasks/${task.id}`)}
              className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:border-gray-300 transition">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-base">{ICONS[task.category] || '📋'}</div>
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">Open</span>
                </div>
                <span className="font-bold text-[#1a1f2e] text-lg">${task.budget}</span>
              </div>
              <h3 className="font-bold text-[#1a1f2e] text-base mb-1">{task.title}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{task.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>📍 {task.location}</span>
                {task.task_date && <span>📅 {new Date(task.task_date).toLocaleDateString('en',{month:'short',day:'numeric'})}</span>}
                {task.applicant_count > 0 && <span>👥 {task.applicant_count} applied</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
