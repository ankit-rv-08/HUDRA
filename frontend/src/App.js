import { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [result, setResult] = useState(null);

  const analyzeTask = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/tasks/analyze/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <h1 className="text-4xl font-bold text-white text-center mb-8">🚀 HUDRA Task Analyzer</h1>
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Paste task: deploy hudra render..."
        />
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl transition-all"
          onClick={analyzeTask}
        >
          Analyze & Score
        </button>
        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-xl">
            <h3 className="font-bold text-lg mb-2">Score: {result.score}/10</h3>
            <p>{result.analysis}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
