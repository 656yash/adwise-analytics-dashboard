import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { formatCurrency } from '../utils/kpiCalculations';
import { downloadCSV } from '../utils/exportCsv';

const COLORS = ['#7D5BA6', '#D65A92', '#D14A81', '#5B9DD9', '#4A90E2'];

export default function CustomerAnalytics() {
  const { users, orders, loading } = useData();

  if (loading) return <div className="p-10">Loading...</div>;

  const newVsReturning = [
    { name: 'New Customers', value: users.filter(u => u.createdAt?.toMillis && (Date.now() - u.createdAt.toMillis()) < 30*24*60*60*1000).length || 1 },
    { name: 'Returning Customers', value: users.length > 1 ? users.length - 1 : 1 }
  ];

  const topCustomers = users.map(u => {
    const userOrders = orders.filter(o => o.userId === u.uid);
    const revenue = userOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    return { name: u.name, email: u.email, orders: userOrders.length, revenue };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Customer Analytics</h1>
        <button 
          onClick={() => downloadCSV(topCustomers, 'customer_analytics')}
          className="flex items-center gap-2 glass-button px-6 py-2 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">New vs Returning Customers</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={newVsReturning} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                  {newVsReturning.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel-alt p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Customers by Revenue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20 text-slate-500 uppercase text-xs tracking-wider">
                  <th className="p-3 font-bold">Customer</th>
                  <th className="p-3 font-bold">Orders</th>
                  <th className="p-3 font-bold">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((cust, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/20 transition-colors">
                    <td className="p-3">
                      <p className="font-medium text-slate-800">{cust.name}</p>
                      <p className="text-xs text-slate-500">{cust.email}</p>
                    </td>
                    <td className="p-3 text-slate-600">{cust.orders}</td>
                    <td className="p-3 font-bold text-pink-600">{formatCurrency(cust.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
