import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    }
    setLoading(false);
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-animated-blobs flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 grid-overlay z-0 pointer-events-none"></div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md glass-panel p-8 md:p-10 z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/">
            <img src="/adwise-logo.svg" alt="Adwise Logo" className="w-16 h-16 mb-4 drop-shadow-md cursor-pointer hover:scale-105 transition-transform" />
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-600 mt-2 text-center">Log in to your Adwise dashboard to view your analytics.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-600 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/40 focus:border-white/80 focus:ring-4 focus:ring-white/20 rounded-xl outline-none transition-all placeholder-slate-400 font-medium"
                placeholder="admin@adwise.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/40 focus:border-white/80 focus:ring-4 focus:ring-white/20 rounded-xl outline-none transition-all placeholder-slate-400 font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging In...' : 'Log In'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 font-medium">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800 font-bold ml-1">Sign Up</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
