import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BrowseTasks from './pages/BrowseTasks';
import PostTask from './pages/PostTask';
import TaskDetail from './pages/TaskDetail';
import Payment from './pages/Payment';
import Wallet from './pages/Wallet';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import ReportDispute from './pages/ReportDispute';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center text-gray-400">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse" element={<BrowseTasks />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/post-task" element={<ProtectedRoute><PostTask /></ProtectedRoute>} />
        <Route path="/payment/:id" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tasks/:id/dispute" element={<ProtectedRoute><ReportDispute /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
