import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, MapPin, Calendar, DollarSign } from 'lucide-react';
import API from '../api';

const CATEGORIES = ['moving','cleaning','pet_care','event_help','handyman','errands','gardening','delivery','tech_setup'];

export default function PostTask() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title:'', description:'', category:'errands', location:'', task_date:'', budget:'', budget_type:'fixed' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inp = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10";

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

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-start justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-2xl p-10">

        {step === 1 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles size={28} className="text-gray-500" />
            </div>
            <h1 className="text-3xl font-bold text-[#1a1f2e] mb-2">What do you need done?</h1>
            <p className="text-gray-500 mb-8">Describe your task in your own words. We'll help you organize the details.</p>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-5 py-4 text-gray-700 text-sm outline-none focus:border-[#6366f1] h-44 resize-none mb-6"
              placeholder="e.g., I need someone to help me move a sofa from my apartment to a new place across town this Saturday..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
            <button
              onClick={() => { if(form.description.trim()) setStep(2); }}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${
                form.description.trim() ? 'bg-[#1a1f2e] hover:bg-[#2d3548]' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 text-sm">← Back</button>
              <h1 className="text-xl font-bold text-[#1a1f2e]">Task Details</h1>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl mb-4 border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Task Title</label>
                <input className={inp} placeholder="e.g. Help me move a sofa"
                  value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category</label>
                <select className={inp} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1"><MapPin size={13} />Location</label>
                <input className={inp} placeholder="e.g. Jurong East, Singapore"
                  value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1"><Calendar size={13} />Date</label>
                  <input type="date" className={inp} value={form.task_date} onChange={e => setForm({...form, task_date: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1"><DollarSign size={13} />Budget (SGD)</label>
                  <input type="number" className={inp} placeholder="100"
                    value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Budget Type</label>
                <div className="flex gap-3">
                  {['fixed','offers'].map(type => (
                    <button type="button" key={type} onClick={() => setForm({...form, budget_type: type})}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition capitalize ${
                        form.budget_type === type ? 'bg-[#6366f1] text-white border-[#6366f1]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#6366f1]'
                      }`}>
                      {type === 'fixed' ? 'Fixed Price' : 'Open to Offers'}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#6366f1] text-white font-semibold py-3.5 rounded-xl hover:bg-[#5558e3] transition disabled:opacity-50">
                {loading ? 'Posting...' : 'Post Task'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
