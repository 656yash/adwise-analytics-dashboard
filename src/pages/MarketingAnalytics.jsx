import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '../utils/kpiCalculations';
import { downloadCSV } from '../utils/exportCsv';
import { Download } from 'lucide-react';

export default function MarketingAnalytics() {
  const { events, loading } = useData();

  if (loading) return <div className="p-10">Loading...</div>;

  const adEvents = events.filter(e => e.eventType === 'ad_impression' || e.eventType === 'ad_click');
  const campaignStats = adEvents.reduce((acc, event) => {
    const name = event.campaignName || 'Unknown Promo';
    if (!acc[name]) acc[name] = { name, impressions: 0, clicks: 0 };
    if (event.eventType === 'ad_impression') acc[name].impressions += 1;
    if (event.eventType === 'ad_click') acc[name].clicks += 1;
    return acc;
  }, {});

  const marketingData = Object.values(campaignStats).map(camp => ({
    name: camp.name,
    impressions: camp.impressions,
    clicks: camp.clicks,
    ctr: camp.impressions ? (camp.clicks / camp.impressions) * 100 : 0,
    promoValue: camp.clicks * 15, // Mock ₹15 per click value
    cpc: 15,
    conversions: Math.floor(camp.clicks * 0.05), // Mock 5% conversion
    revenue: camp.clicks * 15 * 1.5 // Mock 1.5x return on promo value
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Marketing Analytics</h1>
        <button 
          onClick={() => downloadCSV(marketingData, 'marketing_analytics')}
          className="flex items-center gap-2 glass-button px-6 py-2 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <motion.div variants={itemVariants} className="glass-panel p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Internal Promotions Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-slate-500 uppercase text-xs tracking-wider">
                <th className="p-4 font-bold">Campaign Name</th>
                <th className="p-4 font-bold">Impressions</th>
                <th className="p-4 font-bold">Clicks</th>
                <th className="p-4 font-bold">CTR</th>
                <th className="p-4 font-bold">Promo Value</th>
                <th className="p-4 font-bold">CPC</th>
                <th className="p-4 font-bold">Conversions</th>
                <th className="p-4 font-bold">Revenue</th>
                <th className="p-4 font-bold">Return (Eqv)</th>
              </tr>
            </thead>
            <tbody>
              {marketingData.map((row, i) => (
                <tr key={i} className="border-b border-white/10 hover:bg-white/20 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{row.name}</td>
                  <td className="p-4 text-slate-600">{formatNumber(row.impressions)}</td>
                  <td className="p-4 text-slate-600">{formatNumber(row.clicks)}</td>
                  <td className="p-4 text-slate-600">{row.ctr.toFixed(2)}%</td>
                  <td className="p-4 font-semibold text-slate-800">{formatCurrency(row.promoValue)}</td>
                  <td className="p-4 text-slate-600">{formatCurrency(row.cpc)}</td>
                  <td className="p-4 text-slate-600">{formatNumber(row.conversions)}</td>
                  <td className="p-4 font-semibold text-pink-600">{formatCurrency(row.revenue)}</td>
                  <td className="p-4 font-bold text-blue-600">{(row.promoValue > 0 ? row.revenue / row.promoValue : 0).toFixed(2)}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-panel-alt p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Promo Value vs Revenue Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none' }} />
              <Bar dataKey="promoValue" fill="#BDE0FE" radius={[4, 4, 0, 0]} name="Promo Value" />
              <Bar dataKey="revenue" fill="#FFC8DD" radius={[4, 4, 0, 0]} name="Generated Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
