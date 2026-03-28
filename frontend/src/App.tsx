import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Brain, Zap, Ghost, AlertTriangle, TrendingUp, Clock, LayoutDashboard, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const COLORS = {
  'Deep Work': '#6366f1',
  'Passive Consumption': '#f43f5e',
  'Fragmented Attention': '#f59e0b',
  'Neutral': '#94a3b8'
};

const App = () => {
  const [stats, setStats] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const server = 'http://localhost:8000';
      const [statsRes, timelineRes] = await Promise.all([
        fetch(`${server}/stats`),
        fetch(`${server}/timeline`)
      ]);
      const [statsData, timelineData] = await Promise.all([
        statsRes.json(),
        timelineRes.json()
      ]);
      setStats(statsData);
      setTimeline(timelineData.reverse());
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#090e1a] text-white">
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <Zap className="text-indigo-500 w-8 h-8" />
      </motion.div>
    </div>
  );

  const chartData = stats ? Object.entries(stats.stats).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="min-h-screen bg-[#090e1a] text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* Sidebar Navigation (Slim) */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 border-r border-white/5 flex flex-col items-center py-8 gap-10 bg-[#090e1a] z-50">
        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
          <Zap className="w-6 h-6" />
        </div>
        <nav className="flex flex-col gap-8">
          <NavItem icon={<LayoutDashboard className="w-5 h-5" />} active />
          <NavItem icon={<TrendingUp className="w-5 h-5" />} />
          <NavItem icon={<Settings className="w-5 h-5" />} />
        </nav>
      </aside>

      <main className="pl-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-10 py-12">
          {/* Header */}
          <header className="flex justify-between items-end mb-16">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <h1 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Portfolio Overview</h1>
              <h2 className="text-5xl font-black text-white tracking-tight">Attention Ledger Engine</h2>
            </motion.div>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              Live Protocol Active
            </div>
          </header>

          <div className="grid grid-cols-12 gap-10">
            {/* Left Column: Hero ROI & Core Metrics */}
            <div className="col-span-12 lg:col-span-8 space-y-10">
              <div className="grid grid-cols-2 gap-10">
                {/* Hero ROI Section */}
                <motion.section 
                  initial={{ scale: 0.95, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  className="col-span-1 glass-card p-10 flex flex-col justify-between items-center text-center bg-gradient-to-br from-indigo-500/10 to-transparent relative overflow-hidden group"
                >
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <TrendingUp className="w-32 h-32" />
                   </div>
                   <h3 className="text-xs uppercase font-black tracking-widest text-slate-500">Net Return on Attention</h3>
                   <div className="my-8">
                      <p className="text-7xl font-mono font-black text-white leading-none">
                        {stats?.roi.toFixed(0)}<span className="text-indigo-400 text-4xl">%</span>
                      </p>
                      <p className="text-sm text-slate-500 mt-4 font-bold">Performance Delta: +2.4%</p>
                   </div>
                   <button className="text-[10px] uppercase font-bold tracking-widest px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all">
                      View Historical ROI
                   </button>
                </motion.section>

                {/* Cognitive Breakdown Card */}
                <motion.section 
                  initial={{ scale: 0.95, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="col-span-1 glass-card p-8 bg-slate-900/20"
                >
                   <h3 className="text-xs uppercase font-black tracking-widest text-slate-500 mb-6">Asset Allocation</h3>
                   <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={10}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((_entry: any, index) => (
                            <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} className="hover:opacity-80 transition-opacity" />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <LayoutDashboard className="w-6 h-6 text-slate-700" />
                    </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 mt-6">
                      {Object.entries(COLORS).map(([name, color]) => (
                        <div key={name} className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                           <span className="text-[10px] font-bold text-slate-500 truncate">{name}</span>
                        </div>
                      ))}
                   </div>
                </motion.section>
              </div>

              {/* Activity Timeline (Streamlined) */}
              <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs uppercase font-black tracking-widest text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Focus Stream
                  </h3>
                  <div className="flex gap-1">
                    {timeline.slice(-40).map((log, i) => (
                      <div 
                        key={i} 
                        className="w-2.5 h-6 rounded-sm opacity-60 hover:opacity-100 transition-all hover:scale-y-125"
                        style={{ backgroundColor: COLORS[log.cognitive_state as keyof typeof COLORS] || '#1e293b' }}
                        title={log.domain}
                      />
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Key Metrics Row */}
              <div className="grid grid-cols-3 gap-8">
                <MiniMetric 
                  icon={<Brain className="text-indigo-400 w-4 h-4" />} 
                  title="Deep Stacks" 
                  value={stats?.stats['Deep Work'] || 0} 
                  unit="min"
                />
                <MiniMetric 
                  icon={<AlertTriangle className="text-amber-400 w-4 h-4" />} 
                  title="Switch Tax" 
                  value={stats?.stats['Fragmented Attention'] || 0} 
                  unit="min"
                />
                <MiniMetric 
                  icon={<Ghost className="text-rose-400 w-4 h-4" />} 
                  title="Leakage" 
                  value={stats?.stats['Passive Consumption'] || 0} 
                  unit="min"
                />
              </div>
            </div>

            {/* Right Column: Insights & Ledger History */}
            <div className="col-span-12 lg:col-span-4 space-y-10">
               <motion.section 
                initial={{ x: 20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: 0.3 }}
                className="glass-card p-8 border-indigo-500/20 bg-indigo-500/5 space-y-8"
               >
                  <h3 className="text-xs uppercase font-black tracking-widest text-slate-400">Ledger Insights</h3>
                  <InsightItem 
                    title="Cognitive Reserve"
                    text={stats?.roi > 50 ? "High flow potential. Ready for aggressive deep work." : "Attention fatigue detected. Prioritize single-tasking."}
                    status={stats?.roi > 50 ? "optimal" : "warning"}
                  />
                  <InsightItem 
                    title="Audit Recommendation"
                    text="Your 'Leakage' is up 12% today. Review your YouTube consumption."
                    status="info"
                  />
               </motion.section>

               <motion.section 
                initial={{ x: 20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: 0.4 }}
                className="space-y-6"
               >
                  <h3 className="text-xs uppercase font-black tracking-widest text-slate-500">Transaction History</h3>
                  <div className="space-y-1">
                    {timeline.slice(-6).reverse().map((log, i) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-xl hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[log.cognitive_state as keyof typeof COLORS] }}></div>
                           <div className="overflow-hidden">
                              <p className="text-sm font-bold text-white truncate max-w-[140px] tracking-tight">{log.domain}</p>
                              <p className="text-[10px] text-slate-500 uppercase font-black mt-0.5 tracking-widest">{format(new Date(log.timestamp), 'HH:mm:ss')}</p>
                           </div>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details
                        </div>
                      </div>
                    ))}
                  </div>
               </motion.section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const NavItem = ({ icon, active }: { icon: React.ReactNode, active?: boolean }) => (
  <div className={`p-4 rounded-2xl cursor-pointer transition-all hover:bg-white/5 ${active ? 'text-white bg-white/5' : 'text-slate-600 hover:text-slate-400'}`}>
    {icon}
  </div>
);

const MiniMetric = ({ icon, title, value, unit }: any) => (
  <div className="glass-card p-6 border-white/5 flex flex-col gap-2">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-[10px] uppercase font-black tracking-widest">{title}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-mono font-black text-white leading-none">{value}</span>
      <span className="text-[10px] text-slate-600 font-bold uppercase">{unit}</span>
    </div>
  </div>
);

const InsightItem = ({ title, text, status }: any) => {
  const meta = {
    optimal: { color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    warning: { color: 'text-rose-400', bg: 'bg-rose-500/10' },
    info: { color: 'text-slate-400', bg: 'bg-slate-800/50' }
  };
  const { color, bg } = meta[status as keyof typeof meta] || meta.info;
  
  return (
    <div className="space-y-2">
      <div className={`inline-block px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-widest ${bg} ${color}`}>
        {status}
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest opacity-60 ml-0.5">{title}</p>
      <p className="text-sm font-bold text-slate-200 leading-snug tracking-tight">{text}</p>
    </div>
  );
}

export default App;
