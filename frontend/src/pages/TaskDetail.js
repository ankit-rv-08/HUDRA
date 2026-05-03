import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Users, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function TaskDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState({ proposal: '', price: '', estimated_hours: 1 });
  const [applying, setApplying] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get(`/api/tasks/${id}/`)
      .then(res => setTask(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await API.post(`/api/tasks/${id}/apply/`, proposal);
      setMsg('Application sent!');
      const res = await API.get(`/api/tasks/${id}/`);
      setTask(res.data);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleAppoint = async (applicationId) => {
    try {
      await API.post(`/api/tasks/${id}/appoint/${applicationId}/`);
      const res = await API.get(`/api/tasks/${id}/`);
      setTask(res.data);
      setMsg('Tasker appointed!');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to appoint');
    }
  };

  const handleComplete = async () => {
    try {
      await API.post(`/api/tasks/${id}/complete/`);
      const res = await API.get(`/api/tasks/${id}/`);
      setTask(res.data);
      setMsg('Task completed! Funds released.');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-400">Loading...</div>;
  if (!task) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-400">Task not found</div>;

  const isLister = user?.id === task.created_by?.id;
  const isTasker = user?.id === task.assigned_to?.id;
  const hasApplied = task.applications?.some(a => a.applicant?.id === user?.id);
  const inp = "w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#1DB954]";

  const statusColors = {
    open: 'bg-blue-500/10 text-blue-400',
    appointed: 'bg-yellow-500/10 text-yellow-400',
    payment_confirmed: 'bg-purple-500/10 text-purple-400',
    in_progress: 'bg-orange-500/10 text-orange-400',
    completed: 'bg-green-500/10 text-green-400',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {msg && (
        <div className="mb-4 px-4 py-2 rounded-lg text-sm bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left — task info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-[#1DB954]/10 text-[#1DB954] px-2 py-0.5 rounded-full capitalize">
                {task.category?.replace('_', ' ')}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[task.status] || 'bg-slate-500/10 text-slate-400'}`}>
                {task.status?.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">{task.title}</h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{task.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><MapPin size={14} />{task.location}</span>
              {task.task_date && <span className="flex items-center gap-1.5"><Calendar size={14} />{task.task_date}</span>}
              <span className="flex items-center gap-1.5"><Users size={14} />{task.applicant_count} applicants</span>
            </div>
            <div className="mt-4 pt-4 border-t border-[#334155] text-sm text-slate-400">
              Posted by <span className="text-white">{task.created_by?.first_name || task.created_by?.username}</span>
            </div>
          </div>

          {/* Applications — visible to lister */}
          {isLister && task.applications?.length > 0 && (
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Applicants ({task.applications.length})</h2>
              <div className="space-y-4">
                {task.applications.map(app => (
                  <div key={app.id} className="bg-[#0f172a] rounded-xl p-4 border border-[#334155]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-white font-medium">{app.applicant?.first_name || app.applicant?.username}</div>
                        <div className="text-slate-400 text-sm mt-1">{app.proposal}</div>
                        <div className="flex gap-3 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><DollarSign size={11} />SGD {app.price}</span>
                          <span className="flex items-center gap-1"><Clock size={11} />{app.estimated_hours}h</span>
                          <span className={`px-2 py-0.5 rounded-full capitalize ${
                            app.status === 'accepted' ? 'bg-green-500/10 text-green-400' :
                            app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                            'bg-slate-500/10 text-slate-400'
                          }`}>{app.status}</span>
                        </div>
                      </div>
                      {task.status === 'open' && app.status === 'pending' && (
                        <button
                          onClick={() => handleAppoint(app.id)}
                          className="shrink-0 bg-[#1DB954] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-400 transition"
                        >
                          Appoint
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat button — after appointment */}
          {(isLister || isTasker) && ['appointed','payment_confirmed','in_progress','completed'].includes(task.status) && (
            <button
              onClick={() => navigate(`/chat/${id}`)}
              className="w-full bg-[#1e293b] border border-[#1DB954] text-[#1DB954] font-semibold py-3 rounded-xl hover:bg-[#1DB954]/10 transition"
            >
              Open Chat
            </button>
          )}

          {/* Complete button — lister */}
          {isLister && ['payment_confirmed','in_progress'].includes(task.status) && (
            <button
              onClick={handleComplete}
              className="w-full bg-[#1DB954] text-black font-semibold py-3 rounded-xl hover:bg-green-400 transition"
            >
              Mark as Complete & Release Payment
            </button>
          )}

          {/* Pay button — lister */}
          {isLister && task.status === 'appointed' && (
            <button
              onClick={() => navigate(`/payment/${id}`)}
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-500 transition"
            >
              Confirm & Pay SGD {task.budget}
            </button>
          )}
        </div>

        {/* Right — budget + apply */}
        <div className="space-y-4">
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
            <div className="text-slate-400 text-sm mb-1">Budget</div>
            <div className="text-3xl font-bold text-[#1DB954]">SGD {task.budget}</div>
            <div className="text-xs text-slate-500 mt-1 capitalize">{task.budget_type}</div>
          </div>

          {/* Apply form — non-lister, open task, not yet applied */}
          {!isLister && task.status === 'open' && user && (
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
              {hasApplied ? (
                <div className="text-[#1DB954] text-sm font-medium text-center py-2">✓ Application sent</div>
              ) : (
                <>
                  <h3 className="text-white font-semibold mb-3">Send Proposal</h3>
                  <form onSubmit={handleApply} className="space-y-3">
                    <textarea
                      className={inp + " resize-none h-20"}
                      placeholder="Describe how you'll do this task..."
                      value={proposal.proposal}
                      onChange={e => setProposal({...proposal, proposal: e.target.value})}
                      required
                    />
                    <input
                      type="number"
                      className={inp}
                      placeholder="Your price (SGD)"
                      value={proposal.price}
                      onChange={e => setProposal({...proposal, price: e.target.value})}
                      required
                    />
                    <input
                      type="number"
                      className={inp}
                      placeholder="Estimated hours"
                      value={proposal.estimated_hours}
                      onChange={e => setProposal({...proposal, estimated_hours: e.target.value})}
                      min="1"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="w-full bg-[#1DB954] text-black font-semibold py-2.5 rounded-lg hover:bg-green-400 transition disabled:opacity-50"
                    >
                      {applying ? 'Sending...' : 'Apply Now'}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {!user && task.status === 'open' && (
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 text-center">
              <p className="text-slate-400 text-sm mb-3">Log in to apply for this task</p>
              <button onClick={() => navigate('/login')} className="w-full bg-[#1DB954] text-black font-semibold py-2 rounded-lg hover:bg-green-400 transition">
                Log in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
