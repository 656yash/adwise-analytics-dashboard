import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp, Users, Activity, ShoppingCart, MousePointerClick, Eye, Package } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { calculateKPIs, formatCurrency, formatNumber } from '../utils/kpiCalculations';

export default function DashboardOverview() {
  const { events, orders, campaigns, users, loading } = useData();
  
  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading live data...</div>;

  const kpis = calculateKPIs(events, orders);

  // Simple aggregation for revenue chart based on orders
  const revenueData = orders.reduce((acc, order) => {
    // simplified: just group by status for now or mock trend
    const date = new Date(order.createdAt?.toMillis ? order.createdAt.toMillis() : Date.now()).toLocaleDateString();
    const existing = acc.find(item => item.name === date);
    if (existing) {
      existing.revenue += order.amount || 0;
    } else {
      acc.push({ name: date, revenue: order.amount || 0 });
    }
    return acc;
  }, []);

  // Simple aggregation for internal marketing chart
  // Group analytics_events by campaignName where eventType === 'ad_click' or 'ad_impression'
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
    promoValue: camp.clicks * 15 // Assuming ₹15 value per click
  }));
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        
        {/* Real-time Cards */}
        <div className="flex gap-4">
          <motion.div variants={itemVariants} className="glass-panel px-6 py-3 flex items-center gap-4 bg-blue-sky/20 border-blue-soft/30">
            <div className="relative">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Users</p>
              <p className="text-xl font-black text-slate-800">{users.length}</p>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-panel px-6 py-3 flex items-center gap-4 bg-pink-soft/20 border-pink-rose/30">
            <Eye className="w-5 h-5 text-pink-600" />
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Events Tracked</p>
              <p className="text-xl font-black text-slate-800">{events.length}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Revenue KPIs */}
      <div>
        <h2 className="text-lg font-bold text-slate-700 mb-4 ml-2">Revenue Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: formatCurrency(kpis.totalRevenue), icon: DollarSign, color: 'text-pink-600', bg: 'bg-pink-100' },
            { label: 'Revenue Growth', value: '+12.5%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Avg Order Value', value: formatCurrency(kpis.aov), icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-100' },
            { label: 'Total Orders', value: formatNumber(kpis.totalOrders), icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100' },
          ].map((kpi, i) => (
            <motion.div key={i} variants={itemVariants} className={`${i % 2 === 0 ? 'glass-panel' : 'glass-panel-alt'} p-6 hover:scale-[1.02] transition-transform duration-300`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              </div>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{kpi.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Marketing KPIs */}
      <div>
        <h2 className="text-lg font-bold text-slate-700 mb-4 ml-2">Marketing Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { label: 'Impressions', value: formatNumber(kpis.totalImpressions), icon: Eye },
            { label: 'Clicks', value: formatNumber(kpis.totalClicks), icon: MousePointerClick },
            { label: 'CTR', value: `${kpis.ctr.toFixed(2)}%`, icon: TrendingUp },
            { label: 'CPC Eqv.', value: formatCurrency(kpis.cpc), icon: DollarSign },
            { label: 'Promo Value', value: formatCurrency(kpis.promoValueEquivalent), icon: Activity },
          ].map((kpi, i) => (
            <motion.div key={i} variants={itemVariants} className={`${i % 2 === 0 ? 'glass-panel-alt' : 'glass-panel'} p-6 hover:scale-[1.02] transition-transform duration-300`}>
              <div className="flex items-center gap-3 mb-2">
                <kpi.icon className="w-4 h-4 text-slate-400" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              </div>
              <p className="text-2xl font-black text-slate-800">{kpi.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="glass-panel p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#1d1b1d', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#FFAFCC" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Internal Promo Value</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.2)' }}
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="promoValue" fill="#FFC8DD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
