import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Lock, CreditCard, CheckCircle } from 'lucide-react';
import API from '../api';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/api/tasks/${id}/`).then(res => setTask(res.data)).finally(() => setLoading(false));
  }, [id]);

  const handlePay = async () => {
    setPaying(true);
    setError('');
    try {
      await API.post(`/api/tasks/${id}/pay/`);
      setPaid(true);
      setTimeout(() => navigate(`/tasks/${id}`), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center text-gray-400">Loading...</div>;

  if (paid) return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-[#1a1f2e] mb-2">Payment Confirmed!</h2>
        <p className="text-gray-500 text-sm">Funds are secured. The tasker can now begin work.</p>
        <p className="text-gray-400 text-xs mt-4">Redirecting back to task...</p>
      </div>
    </div>
  );

  const commission = (Number(task?.budget) * 0.10).toFixed(2);
  const taskerReceives = (Number(task?.budget) * 0.90).toFixed(2);

  return (
    <div className="min-h-screen bg-[#f0f4f8] py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Lock size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1f2e]">Confirm Payment</h1>
          <p className="text-gray-500 text-sm mt-1">Funds are held securely until the task is complete</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 mb-4">{error}</div>}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Task Summary</div>
          <div className="font-bold text-[#1a1f2e] text-lg mb-1">{task?.title}</div>
          <div className="text-gray-500 text-sm mb-4">{task?.description?.slice(0, 100)}</div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#6366f1] rounded-full flex items-center justify-center text-white text-xs font-bold">
              {(task?.assigned_to?.first_name || task?.assigned_to?.username || 'T')[0].toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-[#1a1f2e]">{task?.assigned_to?.first_name || task?.assigned_to?.username}</div>
              <div className="text-xs text-gray-400">Appointed tasker</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-4">Payment Breakdown</div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-gray-600">Task budget</span><span className="font-medium text-[#1a1f2e]">SGD {task?.budget}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Platform fee (10%)</span><span className="text-gray-500">SGD {commission}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Tasker receives</span><span className="text-green-600 font-medium">SGD {taskerReceives}</span></div>
            <div className="pt-3 border-t border-gray-100 flex justify-between">
              <span className="font-bold text-[#1a1f2e]">You pay</span>
              <span className="font-bold text-[#1a1f2e] text-lg">SGD {task?.budget}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[{icon: Shield, text:'Funds protected until completion'},{icon: Lock, text:'Secure payment processing'},{icon: CheckCircle, text:'Released only when you approve'}].map(({icon:Icon,text}) => (
            <div key={text} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <Icon size={16} className="text-[#6366f1] mx-auto mb-1.5" />
              <div className="text-xs text-gray-500 leading-tight">{text}</div>
            </div>
          ))}
        </div>

        <button onClick={handlePay} disabled={paying}
          className="w-full bg-[#6366f1] text-white font-bold py-4 rounded-2xl hover:bg-[#5558e3] transition disabled:opacity-50 text-lg flex items-center justify-center gap-2">
          <CreditCard size={20} />
          {paying ? 'Processing...' : `Pay SGD ${task?.budget}`}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
          <Lock size={11} /> Payment secured · Funds released on completion
        </p>
      </div>
    </div>
  );
}
