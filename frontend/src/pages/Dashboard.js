import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Briefcase, Clock, TrendingUp, DollarSign, Star, CheckCircle, ArrowRight } from 'lucide-react';
import API from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('lister');
  const [lister, setLister] = useState(null);
  const [tasker, setTasker] = useState(null);

  useEffect(() => {
    API.get('/api/tasks/dashboard/lister/').then(res => setLister(res.data));
    API.get('/api/tasks/dashboard/tasker/').then(res => setTasker(res.data));
  }, []);

  const StatCard = ({ icon: Icon, label, value, color = 'text-white' }) => (
    <div className="bg-white/20 backdrop-blur rounded-xl p-4">
      <div className="flex items-center gap-2 text-white/70 text-xs mb-1"><Icon size={13} />{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );

  const TaskRow = ({ task }) => (
    <div onClick={() => navigate(`/tasks/${task.id}`)}
      className="flex items-center justify-between p-4 border border-gray-100 rounded-xl cursor-pointer hover:border-[#6366f1] hover:bg-[#f5f3ff] transition">
      <div>
        <div className="font-semibold text-[#1a1f2e] text-sm">{task.title}</div>
        <div className="text-gray-400 text-xs mt-0.5">{task.location} · ${task.budget}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
        task.status === 'open' ? 'bg-blue-50 text-blue-600' :
        task.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
      }`}>{task.status.replace('_',' ')}</span>
    </div>
  );

  return (
    <div>
      {/* Purple header */}
      <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {(user?.first_name || user?.username || 'U')[0].toUpperCase()}
              </div>
              <div>
                <div className="text-white text-xl font-bold">{user?.first_name} {user?.last_name}</div>
                <div className="text-white/70 text-sm">{user?.email}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/post-task')} className="bg-white text-[#6366f1] font-semibold px-5 py-2 rounded-xl hover:bg-gray-50 transition text-sm">
                Post a Task
              </button>
              <button onClick={() => navigate('/browse')} className="border border-white/30 text-white font-semibold px-5 py-2 rounded-xl hover:bg-white/10 transition text-sm">
                Browse Tasks
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={DollarSign} label="Balance" value={`$${Number(tasker?.wallet_balance || 0).toFixed(2)}`} />
            <StatCard icon={Star} label="Reward Points" value={user?.reward_points || 0} />
            <StatCard icon={Star} label="Rating" value={tasker?.average_rating || '0 (0)'} />
            <StatCard icon={CheckCircle} label="Completed" value={tasker?.tasks_completed?.length || 0} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <button onClick={() => setTab('lister')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${tab === 'lister' ? 'bg-white border border-gray-200 shadow-sm text-[#1a1f2e]' : 'text-gray-500 hover:text-gray-700'}`}>
            <ClipboardList size={15} />As Task Lister
          </button>
          <button onClick={() => setTab('tasker')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${tab === 'tasker' ? 'bg-white border border-gray-200 shadow-sm text-[#1a1f2e]' : 'text-gray-500 hover:text-gray-700'}`}>
            <Briefcase size={15} />As Tasker
          </button>
        </div>

        {tab === 'lister' && lister && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: ClipboardList, label: 'Tasks Posted', value: lister.total_posted, color: 'text-[#6366f1]' },
                { icon: Clock, label: 'Open', value: lister.active_tasks?.filter(t=>t.status==='open').length || 0, color: 'text-green-600' },
                { icon: TrendingUp, label: 'In Progress', value: lister.active_tasks?.filter(t=>t.status==='in_progress').length || 0, color: 'text-yellow-600' },
                { icon: DollarSign, label: 'Total Spent', value: `$${lister.completed_tasks?.reduce((s,t)=>s+Number(t.budget),0)||0}`, color: 'text-blue-600' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">{label}</div>
                    <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-opacity-10 flex items-center justify-center`} style={{background:'#f3f4f6'}}>
                    <Icon size={18} className={color} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#1a1f2e]">My Posted Tasks</h2>
                <Link to="/browse" className="text-[#6366f1] text-sm flex items-center gap-1">View all <ArrowRight size={13} /></Link>
              </div>
              {lister.active_tasks?.length === 0 && lister.completed_tasks?.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">No tasks posted yet</div>
              ) : (
                <div className="space-y-2">
                  {[...lister.active_tasks||[], ...lister.completed_tasks||[]].map(t => <TaskRow key={t.id} task={t} />)}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'tasker' && tasker && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: ClipboardList, label: 'Applications', value: tasker.applications_sent?.length || 0, color: 'text-[#6366f1]' },
                { icon: Clock, label: 'Pending', value: tasker.applications_sent?.filter(a=>a.status==='pending').length || 0, color: 'text-yellow-600' },
                { icon: CheckCircle, label: 'Accepted', value: tasker.applications_sent?.filter(a=>a.status==='accepted').length || 0, color: 'text-green-600' },
                { icon: DollarSign, label: 'Total Earned', value: `$${Number(tasker.lifetime_earnings||0).toFixed(0)}`, color: 'text-blue-600' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">{label}</div>
                    <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:'#f3f4f6'}}>
                    <Icon size={18} className={color} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#1a1f2e]">My Applications</h2>
                <Link to="/browse" className="text-[#6366f1] text-sm flex items-center gap-1">Find Tasks <ArrowRight size={13} /></Link>
              </div>
              {tasker.tasks_assigned?.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">You haven't applied to any tasks yet</p>
                  <button onClick={() => navigate('/browse')} className="mt-3 text-[#6366f1] text-sm hover:underline">Browse available tasks</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasker.tasks_assigned?.map(t => <TaskRow key={t.id} task={t} />)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
