import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('lister');
  const [listerData, setListerData] = useState(null);
  const [taskerData, setTaskerData] = useState(null);

  useEffect(() => {
    API.get('/api/tasks/dashboard/lister/').then(res => setListerData(res.data));
    API.get('/api/tasks/dashboard/tasker/').then(res => setTaskerData(res.data));
  }, []);

  const TaskCard = ({ task }) => (
    <Link to={`/tasks/${task.id}`} className="block bg-[#0f172a] border border-[#334155] rounded-xl p-4 hover:border-[#1DB954] transition">
      <div className="flex items-center justify-between">
        <div className="text-white font-medium text-sm">{task.title}</div>
        <span className="text-xs text-slate-400 capitalize">{task.status?.replace('_',' ')}</span>
      </div>
      <div className="text-slate-500 text-xs mt-1">{task.location} · SGD {task.budget}</div>
    </Link>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-slate-400 text-sm mb-6">Welcome back, {user?.first_name || user?.username}</p>

      <div className="flex gap-2 mb-6">
        {['lister','tasker'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition ${
              tab === t ? 'bg-[#1DB954] text-black' : 'bg-[#1e293b] text-slate-300 border border-[#334155]'
            }`}
          >{t} view</button>
        ))}
      </div>

      {tab === 'lister' && listerData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{listerData.total_posted}</div>
              <div className="text-slate-400 text-sm">Tasks Posted</div>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
              <div className="text-2xl font-bold text-[#1DB954]">{listerData.completed_tasks?.length}</div>
              <div className="text-slate-400 text-sm">Completed</div>
            </div>
          </div>
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-3">Active Tasks</h2>
            {listerData.active_tasks?.length === 0
              ? <p className="text-slate-400 text-sm">No active tasks</p>
              : <div className="space-y-2">{listerData.active_tasks?.map(t => <TaskCard key={t.id} task={t} />)}</div>
            }
          </div>
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-3">Completed Tasks</h2>
            {listerData.completed_tasks?.length === 0
              ? <p className="text-slate-400 text-sm">No completed tasks yet</p>
              : <div className="space-y-2">{listerData.completed_tasks?.map(t => <TaskCard key={t.id} task={t} />)}</div>
            }
          </div>
        </div>
      )}

      {tab === 'tasker' && taskerData && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
              <div className="text-2xl font-bold text-[#1DB954]">SGD {Number(taskerData.wallet_balance || 0).toFixed(0)}</div>
              <div className="text-slate-400 text-sm">Balance</div>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{taskerData.tasks_completed?.length}</div>
              <div className="text-slate-400 text-sm">Completed</div>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-400">{taskerData.average_rating || '—'}</div>
              <div className="text-slate-400 text-sm">Avg Rating</div>
            </div>
          </div>
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-3">My Applications</h2>
            {taskerData.applications_sent?.length === 0
              ? <p className="text-slate-400 text-sm">No applications yet — <Link to="/browse" className="text-[#1DB954]">browse tasks</Link></p>
              : <div className="space-y-2">{taskerData.tasks_assigned?.map(t => <TaskCard key={t.id} task={t} />)}</div>
            }
          </div>
        </div>
      )}
    </div>
  );
}
