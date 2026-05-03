import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

export default function ReportDispute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post(`/api/tasks/${id}/dispute/`, { reason });
      setMsg('Dispute reported. Our team will review within 24 hours.');
      setReason('');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-1">Report a Dispute</h1>
      <p className="text-slate-400 text-sm mb-6">Describe the issue and our team will review it</p>

      {msg && <div className="mb-4 px-4 py-2 rounded-lg text-sm bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20">{msg}</div>}

      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Describe the issue</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#1DB954] resize-none h-36"
              placeholder="Explain what went wrong..."
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 py-2.5 rounded-lg border border-[#334155] text-slate-300 text-sm hover:border-slate-400 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-semibold text-sm hover:bg-red-400 transition disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
