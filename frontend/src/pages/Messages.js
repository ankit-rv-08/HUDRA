import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/tasks/')
      .then(res => {
        const myChats = res.data.filter(t =>
          ['appointed','payment_confirmed','in_progress','completed'].includes(t.status) &&
          (t.created_by?.id === user?.id || t.assigned_to?.id === user?.id)
        );
        setTasks(myChats);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>
      {tasks.length === 0 ? (
        <div className="text-center text-slate-400 py-20 bg-[#1e293b] rounded-2xl border border-[#334155]">
          <p className="mb-2">No active chats yet</p>
          <p className="text-sm">Chats open after a tasker is appointed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => {
            const other = task.created_by?.id === user?.id ? task.assigned_to : task.created_by;
            return (
              <div
                key={task.id}
                onClick={() => navigate(`/chat/${task.id}`)}
                className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 cursor-pointer hover:border-[#1DB954] transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{task.title}</div>
                    <div className="text-slate-400 text-sm mt-0.5">with {other?.first_name || other?.username}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    task.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                  }`}>{task.status.replace('_',' ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
