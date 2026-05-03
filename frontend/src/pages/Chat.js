import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Chat() {
  const { id } = useParams();
  const { user } = useAuth();
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 mb-4">
        <div className="text-white font-semibold">{task?.title}</div>
        <div className="text-slate-400 text-xs mt-0.5 capitalize">{task?.status?.replace('_',' ')} · Phone/email sharing is blocked</div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-10">No messages yet. Say hello!</div>
        )}
        {messages.map(msg => {
          const mine = msg.sender?.id === user?.id;
          return (
            <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                mine ? 'bg-[#1DB954] text-black' : 'bg-[#1e293b] text-white border border-[#334155]'
              }`}>
                {!mine && <div className="text-xs font-medium mb-1 opacity-60">{msg.sender?.first_name || msg.sender?.username}</div>}
                {msg.content}
                <div className={`text-xs mt-1 opacity-50 text-right`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#1DB954]"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-[#1DB954] text-black px-4 py-3 rounded-xl hover:bg-green-400 transition disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
