import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Shield, ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Chat() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    API.get(`/api/tasks/${id}/`).then(res => setTask(res.data));
    API.get(`/api/tasks/${id}/messages/`).then(res => setMessages(res.data));
    const interval = setInterval(() => {
      API.get(`/api/tasks/${id}/messages/`).then(res => setMessages(res.data));
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await API.post(`/api/tasks/${id}/messages/`, { content: text });
      setMessages(prev => [...prev, res.data]);
      setText('');
    } finally {
      setSending(false);
    }
  };

  const other = task ? (task.created_by?.id === user?.id ? task.assigned_to : task.created_by) : null;

  const STATUS_COLORS = {
    open: 'bg-green-50 text-green-700',
    appointed: 'bg-yellow-50 text-yellow-700',
    payment_confirmed: 'bg-purple-50 text-purple-700',
    in_progress: 'bg-blue-50 text-blue-700',
    completed: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="bg-[#f0f4f8] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/tasks/${id}`)}
              className="text-gray-400 hover:text-gray-600 transition">
              <ArrowLeft size={18} />
            </button>
            {other && (
              <div className="w-9 h-9 bg-[#6366f1] rounded-full flex items-center justify-center text-white text-sm font-bold">
                {(other?.first_name || other?.username || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <div className="font-semibold text-[#1a1f2e] text-sm">{task?.title}</div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-gray-400 text-xs">
                  with {other?.first_name || other?.username}
                </span>
                {task?.status && (
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${STATUS_COLORS[task.status] || 'bg-gray-100 text-gray-600'}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
              <Shield size={12} /> Secure
            </div>
          </div>

          {/* Task meta */}
          {task && (
            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin size={11} />{task.location}</span>
              {task.task_date && <span className="flex items-center gap-1"><Calendar size={11} />{new Date(task.task_date).toLocaleDateString('en',{month:'short',day:'numeric'})}</span>}
              <span className="text-gray-300">•</span>
              <span className="text-[#6366f1] font-medium">SGD {task.budget}</span>
              <span className="text-gray-300">•</span>
              <span className="text-orange-500">Phone/email sharing is blocked</span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-1">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send size={18} className="text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm">No messages yet</p>
              <p className="text-gray-300 text-xs mt-1">Say hello to get started!</p>
            </div>
          )}
          {messages.map(msg => {
            const mine = msg.sender?.id === user?.id;
            return (
              <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-xs ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!mine && (
                    <div className="w-7 h-7 bg-[#6366f1] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1">
                      {(msg.sender?.first_name || msg.sender?.username || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    {!mine && (
                      <div className="text-xs text-gray-400 mb-1 ml-1">
                        {msg.sender?.first_name || msg.sender?.username}
                      </div>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      mine
                        ? 'bg-[#6366f1] text-white rounded-br-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                    }`}>
                      {msg.content}
                    </div>
                    <div className={`text-xs mt-1 text-gray-400 ${mine ? 'text-right' : 'text-left'} px-1`}>
                      {new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="flex gap-3 shrink-0">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none focus:border-[#6366f1] shadow-sm"
          />
          <button type="submit" disabled={sending || !text.trim()}
            className="bg-[#6366f1] text-white px-4 py-3 rounded-xl hover:bg-[#5558e3] transition disabled:opacity-40 disabled:cursor-not-allowed">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
