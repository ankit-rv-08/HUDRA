import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import API from '../api';

const CATEGORIES = ['all','moving','cleaning','pet_care','event_help','handyman','errands','gardening','delivery','tech_setup'];

export default function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = category !== 'all' ? `?category=${category}` : '';
    API.get(`/api/tasks/${params}`)
      .then(res => setTasks(res.data))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Browse Tasks</h1>
      <p className="text-slate-400 text-sm mb-6">Find tasks near you and send a proposal</p>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition capitalize ${
              category === cat
                ? 'bg-[#1DB954] text-black'
                : 'bg-[#1e293b] text-slate-300 border border-[#334155] hover:border-[#1DB954]'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-20">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center text-slate-400 py-20">No tasks found. <Link to="/post-task" className="text-[#1DB954] hover:underline">Post one!</Link></div>
      ) : (
        <div className="grid gap-4">
          {tasks.map(task => (
            <Link key={task.id} to={`/tasks/${task.id}`} className="block">
              <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 hover:border-[#1DB954] transition group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-[#1DB954]/10 text-[#1DB954] px-2 py-0.5 rounded-full capitalize">
                        {task.category?.replace('_', ' ')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                        task.status === 'open' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <h2 className="text-white font-semibold text-lg group-hover:text-[#1DB954] transition">{task.title}</h2>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">{task.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin size={12} />{task.location}</span>
                      {task.task_date && <span className="flex items-center gap-1"><Calendar size={12} />{task.task_date}</span>}
                      <span className="flex items-center gap-1"><Users size={12} />{task.applicant_count} applicants</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-[#1DB954] font-bold text-xl">
                      <DollarSign size={16} />{task.budget}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{task.budget_type}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}