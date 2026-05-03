import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const CATEGORIES = ['moving','cleaning','pet_care','event_help','handyman','errands','gardening','delivery','tech_setup'];

export default function PostTask() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', category: 'errands',
    location: '', task_date: '', budget: '', budget_type: 'fixed'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/api/tasks/', form);
      navigate(`/tasks/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post task');
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#1DB954]";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-1">Post a Task</h1>
      <p className="text-slate-400 text-sm mb-6">Describe what you need done and set your budget</p>

      {error && <div className="bg-red-500/10 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Task Title</label>
          <input className={inp} placeholder="e.g. Help me move a sofa to 3rd floor"
            value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        </div>

        <div>
          <label className="text-sm text-slate-400 mb-1 block">Description</label>
          <textarea className={inp + " resize-none h-28"} placeholder="Describe the task in detail..."
            value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Category</label>
            <select className={inp} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Location</label>
            <input className={inp} placeholder="e.g. Jurong East, Singapore"
              value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Task Date</label>
            <input type="date" className={inp}
              value={form.task_date} onChange={e => setForm({...form, task_date: e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Budget (SGD)</label>
            <input type="number" className={inp} placeholder="50"
              value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} required />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400 mb-2 block">Budget Type</label>
          <div className="flex gap-3">
            {['fixed', 'offers'].map(type => (
              <button type="button" key={type}
                onClick={() => setForm({...form, budget_type: type})}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition capitalize ${
                  form.budget_type === type
                    ? 'bg-[#1DB954] text-black border-[#1DB954]'
                    : 'bg-transparent text-slate-300 border-[#334155] hover:border-[#1DB954]'
                }`}
              >
                {type === 'fixed' ? 'Fixed Price' : 'Open to Offers'}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-[#1DB954] text-black font-semibold py-3 rounded-lg hover:bg-green-400 transition disabled:opacity-50">
          {loading ? 'Posting...' : 'Post Task'}
        </button>
      </form>
    </div>
  );
}