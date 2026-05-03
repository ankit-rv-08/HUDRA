import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ArrowDownCircle } from 'lucide-react';
import API from '../api';

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/tasks/wallet/me/')
      .then(res => setWallet(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/api/tasks/wallet/withdraw/', { amount });
      setMsg(res.data.message);
      setWallet(prev => ({ ...prev, balance: res.data.new_balance }));
      setAmount('');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Wallet</h1>

      {msg && <div className="mb-4 px-4 py-2 rounded-lg text-sm bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20">{msg}</div>}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2"><DollarSign size={14} />Balance</div>
          <div className="text-3xl font-bold text-[#1DB954]">SGD {Number(wallet?.balance || 0).toFixed(2)}</div>
        </div>
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2"><TrendingUp size={14} />Lifetime Earnings</div>
          <div className="text-3xl font-bold text-white">SGD {Number(wallet?.lifetime_earnings || 0).toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 mb-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><ArrowDownCircle size={16} />Withdraw Funds</h2>
        <form onSubmit={handleWithdraw} className="flex gap-3">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount (SGD)"
            className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#1DB954]"
            required
          />
          <button type="submit" className="bg-[#1DB954] text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-green-400 transition">
            Withdraw
          </button>
        </form>
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4">Transaction History</h2>
        {wallet?.transactions?.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {wallet?.transactions?.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-[#334155] last:border-0">
                <div>
                  <div className="text-white text-sm">{t.description || t.type}</div>
                  <div className="text-slate-500 text-xs">{new Date(t.created_at).toLocaleDateString()}</div>
                </div>
                <div className={`font-semibold ${t.type === 'credit' ? 'text-[#1DB954]' : 'text-red-400'}`}>
                  {t.type === 'credit' ? '+' : '-'}SGD {Number(t.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
