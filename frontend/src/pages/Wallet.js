import { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, Gift } from 'lucide-react';
import API from '../api';

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/tasks/wallet/me/').then(res => setWallet(res.data)).finally(() => setLoading(false));
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1a1f2e] mb-1">Wallet</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your earnings and withdrawals</p>

      {msg && <div className="mb-4 px-4 py-2 rounded-xl text-sm bg-green-50 text-green-700 border border-green-100">{msg}</div>}

      {/* Purple balance card */}
      <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-white/70 text-sm mb-1">Available Balance</div>
            <div className="text-4xl font-bold text-white">${Number(wallet?.balance || 0).toFixed(2)}</div>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <WalletIcon size={18} className="text-white" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 rounded-xl p-3">
            <div className="text-white/70 text-xs mb-1">Pending</div>
            <div className="text-white font-bold">$0.00</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="text-white/70 text-xs mb-1">Total Earned</div>
            <div className="text-white font-bold">${Number(wallet?.lifetime_earnings || 0).toFixed(2)}</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="text-white/70 text-xs mb-1">Rewards</div>
            <div className="text-white font-bold">0 pts</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <ArrowUpRight size={18} className="text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-[#1a1f2e] text-sm">Withdraw</div>
              <div className="text-gray-400 text-xs">Transfer to bank or PayNow</div>
            </div>
          </div>
          <form onSubmit={handleWithdraw} className="flex gap-2">
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="Amount" required
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6366f1]" />
            <button type="submit" className="bg-[#6366f1] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#5558e3] transition font-medium">
              Withdraw
            </button>
          </form>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-3 cursor-pointer hover:border-[#6366f1] transition">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Gift size={18} className="text-[#6366f1]" />
          </div>
          <div>
            <div className="font-semibold text-[#1a1f2e] text-sm">Reward Points</div>
            <div className="text-gray-400 text-xs">0 points available</div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="font-bold text-[#1a1f2e] mb-4">Transaction History</h2>
        {wallet?.transactions?.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {wallet?.transactions?.map(t => (
              <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-[#1a1f2e] text-sm font-medium">{t.description || t.type}</div>
                  <div className="text-gray-400 text-xs">{new Date(t.created_at).toLocaleDateString()}</div>
                </div>
                <div className={`font-bold ${t.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                  {t.type === 'credit' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
