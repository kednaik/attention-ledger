import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Brain, Zap, Ghost, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';

const COLORS = {
  'Deep Work': '#6366f1',
  'Passive Consumption': '#f43f5e',
  'Fragmented Attention': '#f59e0b',
  'Neutral': '#94a3b8'
};

const App = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-[#0f172a] text-white">Loading Attention Ledger...</div>;

  const chartData = stats ? Object.entries(stats.stats).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 bg-grid font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">Attention Ledger</h1>
          <p className="text-slate-400 mt-2 italic">Reflect upon your cognitive dividends.</p>
        </div>
        <div className="flex gap-4">
           <div className="glass-card px-6 py-3 flex items-center gap-3">
             <TrendingUp className="text-indigo-400 w-5 h-5" />
             <div>
               <p className="text-xs uppercase tracking-wider text-slate-500">Attention ROI</p>
               <p className="text-2xl font-mono font-bold text-white">{stats?.roi.toFixed(1)}%</p>
             </div>
           </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard 
          title="Deep Work" 
          value={stats?.stats['Deep Work'] || 0} 
          unit="min" 
          icon={<Brain className="text-indigo-400" />} 
          color="border-indigo-500/30"
          desc="Investment in high-leverage focus."
        />
        <MetricCard 
          title="Fragmented" 
          value={stats?.stats['Fragmented Attention'] || 0} 
          unit="min" 
          icon={<AlertTriangle className="text-amber-400" />} 
          color="border-amber-500/30"
          desc="The cost of context switching."
        />
        <MetricCard 
          title="Debt Incurred" 
          value={stats?.stats['Passive Consumption'] || 0} 
          unit="min" 
          icon={<Ghost className="text-rose-400" />} 
          color="border-rose-500/30"
          desc="Time lost to behavioral loops."
        />

        <section className="md:col-span-2 glass-card p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Zap className="text-yellow-400 w-5 h-5" />
            Cognitive State Breakdown
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_entry: any, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center flex-wrap gap-4 md:gap-8 mt-4">
               {Object.entries(COLORS).map(([name, color]) => (
                 <div key={name} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                   <span className="text-xs text-slate-400">{name}</span>
                 </div>
               ))}
          </div>
        </section>

        <section className="glass-card p-6 flex flex-col justify-between">
           <div>
              <h2 className="text-xl font-semibold mb-2">Ledger Insights</h2>
              <p className="text-sm text-slate-400 mb-6">Real-time analysis of your cognitive flow.</p>
              
              <div className="space-y-4">
                 <InsightItem 
                   text={stats?.roi > 50 ? "Healthy ROI. Your attention is focused." : "High debt detected. Minimize tab switching."}
                   type={stats?.roi > 50 ? "success" : "warning"}
                 />
                 <InsightItem 
                    text="Identify focus leaks early to reclaim flow."
                    type="info"
                 />
              </div>
           </div>
           
           <button className="mt-8 w-full py-4 glass-card border-slate-700/50 hover:bg-white/5 transition-all flex items-center justify-center gap-2 group">
             Reclaim Focus
             <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </button>
        </section>
      </main>
    </div>
  );
}

const MetricCard = ({ title, value, unit, icon, color, desc }: any) => (
  <div className={`glass-card p-6 border-b-4 ${color}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-800/50 rounded-lg">{icon}</div>
      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-mono font-bold">{value}</span>
      <span className="text-slate-500 text-sm">{unit}</span>
    </div>
    <p className="text-xs text-slate-500 mt-4 leading-relaxed">{desc}</p>
  </div>
);

const InsightItem = ({ text, type }: any) => {
  const colors = {
    success: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    warning: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    info: 'bg-slate-500/10 text-slate-300 border-slate-500/20'
  };
  return (
    <div className={`p-4 rounded-lg border text-sm ${colors[type as keyof typeof colors]}`}>
      {text}
    </div>
  );
}

export default App;
