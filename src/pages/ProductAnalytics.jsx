import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { formatCurrency, formatNumber } from '../utils/kpiCalculations';
import { downloadCSV } from '../utils/exportCsv';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductAnalytics() {
  const { events, orders, loading } = useData();

  if (loading) return <div className="p-10">Loading...</div>;

  // Real views from events
  const viewCounts = events.filter(e => e.eventType === 'product_view').reduce((acc, e) => {
    if (e.productId) acc[e.productId] = (acc[e.productId] || 0) + 1;
    return acc;
  }, {});

  // Aggregate product data from orders
  const productStats = {};
  orders.forEach(order => {
    (order.items || []).forEach(item => {
      if (!productStats[item.id]) {
        productStats[item.id] = { name: item.name, purchases: 0, revenue: 0, views: viewCounts[item.id] || 1 }; 
      }
      productStats[item.id].purchases += item.quantity || 1;
      productStats[item.id].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });

  const topProducts = Object.values(productStats).sort((a, b) => b.revenue - a.revenue);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Product Analytics</h1>
        <button 
          onClick={() => downloadCSV(topProducts, 'product_analytics')}
          className="flex items-center gap-2 glass-button px-6 py-2 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Products Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20 text-slate-500 uppercase text-xs tracking-wider">
                  <th className="p-3 font-bold">Product Name</th>
                  <th className="p-3 font-bold">Views</th>
                  <th className="p-3 font-bold">Purchases</th>
                  <th className="p-3 font-bold">Conv. Rate</th>
                  <th className="p-3 font-bold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((prod, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/20 transition-colors">
                    <td className="p-3 font-medium text-slate-800">{prod.name}</td>
                    <td className="p-3 text-slate-600">{formatNumber(prod.views)}</td>
                    <td className="p-3 text-slate-600">{formatNumber(prod.purchases)}</td>
                    <td className="p-3 text-blue-600 font-medium">
                      {((prod.purchases / prod.views) * 100).toFixed(1)}%
                    </td>
                    <td className="p-3 font-bold text-pink-600">{formatCurrency(prod.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel-alt p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue by Product</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts.slice(0, 5)} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={100} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none' }} />
                <Bar dataKey="revenue" fill="#CDB4DB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
