import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/api/tasks/').then(res => {
      const chats = res.data.filter(t =>
        ['appointed','payment_confirmed','in_progress','completed'].includes(t.status) &&
        (t.created_by?.id === user?.id || t.assigned_to?.id === user?.id)
      );
      setTasks(chats);
    });
  }, [user]);

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1f2e]">Messages</h1>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
          <Shield size={14} />Secure chat
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#6366f1] shadow-sm" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#1a1f2e] mb-2">No conversations yet</h3>
          <p className="text-gray-500 text-sm mb-6">Conversations appear here when you're appointed to a task or appoint a tasker.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/post-task')} className="bg-[#6366f1] text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-[#5558e3] transition">
              Post a Task
            </button>
            <button onClick={() => navigate('/browse')} className="border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-xl hover:border-gray-400 transition">
              Browse Tasks
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(task => {
            const other = task.created_by?.id === user?.id ? task.assigned_to : task.created_by;
            return (
              <div key={task.id} onClick={() => navigate(`/chat/${task.id}`)}
                className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#6366f1] hover:shadow-sm transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6366f1] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {(other?.first_name || other?.username || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#1a1f2e] text-sm">{task.title}</div>
                    <div className="text-gray-400 text-xs">with {other?.first_name || other?.username}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${
                    task.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
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
