import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Users, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const STATUS_COLORS = {
  open: 'bg-green-50 text-green-700 border border-green-200',
  appointed: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  payment_confirmed: 'bg-purple-50 text-purple-700 border border-purple-200',
  in_progress: 'bg-blue-50 text-blue-700 border border-blue-200',
  completed: 'bg-gray-50 text-gray-600 border border-gray-200',
};

export default function TaskDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState({ proposal: '', price: '', estimated_hours: 1 });
  const [applying, setApplying] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');

  const inp = "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10";

  useEffect(() => {
    API.get(`/api/tasks/${id}/`)
      .then(res => setTask(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const refresh = () => API.get(`/api/tasks/${id}/`).then(res => setTask(res.data));

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await API.post(`/api/tasks/${id}/apply/`, proposal);
      setMsg('Application sent successfully!');
      setMsgType('success');
      refresh();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to apply');
      setMsgType('error');
    } finally {
      setApplying(false);
    }
  };

  const handleAppoint = async (applicationId) => {
    try {
      await API.post(`/api/tasks/${id}/appoint/${applicationId}/`);
      setMsg('Tasker appointed successfully!');
      setMsgType('success');
      refresh();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to appoint');
      setMsgType('error');
    }
  };

  const handleComplete = async () => {
    try {
      await API.post(`/api/tasks/${id}/complete/`);
      setMsg('Task completed! Funds released to tasker.');
      setMsgType('success');
      refresh();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed');
      setMsgType('error');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
      <div className="text-gray-400 text-sm">Loading task...</div>
    </div>
  );

  if (!task) return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
      <div className="text-gray-400 text-sm">Task not found</div>
    </div>
  );

  const isLister = user?.id === task.created_by?.id;
  const isTasker = user?.id === task.assigned_to?.id;
  const hasApplied = task.applications?.some(a => a.applicant?.id === user?.id);
  const canChat = (isLister || isTasker) && ['appointed','payment_confirmed','in_progress','completed'].includes(task.status);

  const ICONS = { moving:'🚚', cleaning:'✨', pet_care:'🐾', event_help:'🎉', handyman:'🔧', delivery:'📦', tech_setup:'💻', errands:'🛍️', gardening:'🌿' };

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">

        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm border flex items-center gap-2 ${
            msgType === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
          }`}>
            {msg}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* LEFT — main content */}
          <div className="col-span-2 space-y-4">

            {/* Task card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-base">
                  {ICONS[task.category] || '📋'}
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[task.status] || 'bg-gray-50 text-gray-600'}`}>
                  {task.status?.replace('_', ' ')}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-[#1a1f2e] mb-3">{task.title}</h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{task.description}</p>

              <div className="flex flex-wrap gap-5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" />{task.location}</span>
                {task.task_date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    {new Date(task.task_date).toLocaleDateString('en', {month:'short', day:'numeric', year:'numeric'})}
                  </span>
                )}
                <span className="flex items-center gap-1.5"><Users size={14} className="text-gray-400" />{task.applicant_count} applicants</span>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-2">
                <div className="w-7 h-7 bg-[#6366f1] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {(task.created_by?.first_name || task.created_by?.username || 'U')[0].toUpperCase()}
                </div>
                <span className="text-sm text-gray-500">
                  Posted by <span className="text-[#1a1f2e] font-medium">{task.created_by?.first_name || task.created_by?.username}</span>
                </span>
              </div>
            </div>

            {/* Applicants — lister only */}
            {isLister && task.applications?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="font-bold text-[#1a1f2e] mb-4">Applicants ({task.applications.length})</h2>
                <div className="space-y-3">
                  {task.applications.map(app => (
                    <div key={app.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-[#6366f1] rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {(app.applicant?.first_name || app.applicant?.username || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-[#1a1f2e] text-sm">
                              {app.applicant?.first_name || app.applicant?.username}
                            </div>
                            <div className="text-gray-500 text-sm mt-1">{app.proposal}</div>
                            <div className="flex gap-3 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1"><DollarSign size={11} />SGD {app.price}</span>
                              <span className="flex items-center gap-1"><Clock size={11} />{app.estimated_hours}h estimated</span>
                              <span className={`px-2 py-0.5 rounded-full font-medium capitalize ${
                                app.status === 'accepted' ? 'bg-green-50 text-green-700' :
                                app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                'bg-gray-50 text-gray-500'
                              }`}>{app.status}</span>
                            </div>
                          </div>
                        </div>
                        {task.status === 'open' && app.status === 'pending' && (
                          <button
                            onClick={() => handleAppoint(app.id)}
                            className="shrink-0 bg-[#6366f1] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#5558e3] transition"
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

            {/* Action buttons */}
            <div className="space-y-3">
              {canChat && (
                <button
                  onClick={() => navigate(`/chat/${id}`)}
                  className="w-full bg-white border-2 border-[#6366f1] text-[#6366f1] font-semibold py-3 rounded-xl hover:bg-[#f5f3ff] transition flex items-center justify-center gap-2"
                >
                  💬 Open Chat
                </button>
              )}

              {isLister && task.status === 'appointed' && (
                <button
                  onClick={() => navigate(`/payment/${id}`)}
                  className="w-full bg-[#6366f1] text-white font-semibold py-3 rounded-xl hover:bg-[#5558e3] transition"
                >
                  Confirm & Pay SGD {task.budget}
                </button>
              )}

              {isLister && ['payment_confirmed','in_progress'].includes(task.status) && (
                <button
                  onClick={handleComplete}
                  className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-500 transition"
                >
                  ✓ Mark as Complete & Release Payment
                </button>
              )}

              {(isLister || isTasker) && (
                <button
                  onClick={() => navigate(`/tasks/${id}/dispute`)}
                  className="w-full bg-white border border-gray-200 text-gray-500 text-sm font-medium py-2.5 rounded-xl hover:border-red-200 hover:text-red-500 transition flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={14} /> Report a Dispute
                </button>
              )}
            </div>
          </div>

          {/* RIGHT sidebar */}
          <div className="space-y-4">
            {/* Budget */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Budget</div>
              <div className="text-3xl font-bold text-[#1a1f2e]">SGD {task.budget}</div>
              <div className="text-xs text-gray-400 mt-1 capitalize">{task.budget_type === 'fixed' ? 'Fixed price' : 'Open to offers'}</div>
            </div>

            {/* Apply form */}
            {!isLister && task.status === 'open' && user && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                {hasApplied ? (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 text-lg">✓</span>
                    </div>
                    <div className="text-green-700 font-semibold text-sm">Application sent!</div>
                    <div className="text-gray-400 text-xs mt-1">Waiting for lister to review</div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-[#1a1f2e] mb-4">Send a Proposal</h3>
                    <form onSubmit={handleApply} className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Your proposal</label>
                        <textarea
                          className={inp + " resize-none h-24"}
                          placeholder="Describe how you'll handle this task..."
                          value={proposal.proposal}
                          onChange={e => setProposal({...proposal, proposal: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Your price (SGD)</label>
                        <input type="number" className={inp} placeholder="50"
                          value={proposal.price}
                          onChange={e => setProposal({...proposal, price: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Estimated hours</label>
                        <input type="number" className={inp} placeholder="2" min="1"
                          value={proposal.estimated_hours}
                          onChange={e => setProposal({...proposal, estimated_hours: e.target.value})}
                        />
                      </div>
                      <button type="submit" disabled={applying}
                        className="w-full bg-[#6366f1] text-white font-semibold py-2.5 rounded-xl hover:bg-[#5558e3] transition disabled:opacity-50">
                        {applying ? 'Sending...' : 'Apply Now'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}

            {!user && task.status === 'open' && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
                <p className="text-gray-500 text-sm mb-3">Log in to apply for this task</p>
                <button onClick={() => navigate('/login')}
                  className="w-full bg-[#6366f1] text-white font-semibold py-2.5 rounded-xl hover:bg-[#5558e3] transition text-sm">
                  Log in to Apply
                </button>
              </div>
            )}

            {/* Task assigned to */}
            {task.assigned_to && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Assigned Tasker</div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#6366f1] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(task.assigned_to?.first_name || task.assigned_to?.username || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1a1f2e] text-sm">
                      {task.assigned_to?.first_name || task.assigned_to?.username}
                    </div>
                    <div className="text-xs text-gray-400">Appointed tasker</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
