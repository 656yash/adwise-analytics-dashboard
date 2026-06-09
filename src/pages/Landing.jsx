import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function Landing() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen w-full bg-animated-blobs overflow-hidden flex flex-col items-center justify-center text-center px-4"
    >
      <div className="absolute inset-0 grid-overlay z-0 pointer-events-none"></div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <img 
          src="/adwise-logo.svg" 
          alt="Adwise Logo" 
          className="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] mb-6" 
        />
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
          Adwise
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-md font-medium mb-12 drop-shadow">
          Next-generation marketing analytics to unlock your true revenue potential.
        </p>

        {currentUser ? (
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Enter Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-xl"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all hover:scale-105"
            >
              Create Account
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
