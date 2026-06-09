import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download } from 'lucide-react';
import { formatCurrency } from '../utils/kpiCalculations';
import { downloadCSV } from '../utils/exportCsv';

export default function RevenueAnalytics() {
  const { orders, loading } = useData();

  if (loading) return <div className="p-10">Loading...</div>;

  const revenueData = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt?.toMillis ? order.createdAt.toMillis() : Date.now()).toLocaleDateString();
    const existing = acc.find(item => item.name === date);
    if (existing) {
      existing.revenue += order.amount || 0;
    } else {
      acc.push({ name: date, revenue: order.amount || 0 });
    }
    return acc;
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Revenue Analytics</h1>
        <button 
          onClick={() => downloadCSV(revenueData, 'revenue_analytics')}
          className="flex items-center gap-2 glass-button px-6 py-2 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Trend (Area)</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFAFCC" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FFAFCC" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => `₹${val}`} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none' }} />
              <Area type="monotone" dataKey="revenue" stroke="#FFAFCC" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
