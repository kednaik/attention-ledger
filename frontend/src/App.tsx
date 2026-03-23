import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Brain, Zap, Ghost, AlertTriangle, TrendingUp, ChevronRight, Activity, Clock } from 'lucide-react';
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
    <div className="h-screen w-screen flex items-center justify-center bg-[#0f172a] text-white">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
        <Zap className="text-indigo-500 w-12 h-12" />
      </motion.div>
    </div>
  );

  const chartData = stats ? Object.entries(stats.stats).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-8 bg-grid font-sans overflow-x-hidden">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-white to-rose-400 bg-clip-text text-transparent tracking-tight">
            Attention Ledger
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-slate-400 text-sm italic">Tracking cognitive flow in real-time</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex gap-4">
           <div className="glass-card px-8 py-4 flex items-center gap-4 bg-indigo-500/5">
             <div className="p-3 bg-indigo-500/10 rounded-full">
               <TrendingUp className="text-indigo-400 w-6 h-6" />
             </div>
             <div>
               <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Attention ROI</p>
               <p className="text-4xl font-mono font-black text-white">{stats?.roi.toFixed(1)}%</p>
             </div>
           </div>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Timeline Horizontal Bar */}
        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-6 bg-slate-900/40">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-tight text-slate-300">
                <Clock className="text-indigo-400 w-5 h-5" /> Activity Stream
              </h2>
              <span className="text-xs text-slate-500">Live Feedback (Last 100 blocks)</span>
           </div>
           <div className="flex h-12 w-full gap-0.5 rounded-lg overflow-hidden border border-white/5 shadow-2xl">
              {timeline.map((log, i) => (
                <div 
                   key={i} 
                   className="h-full flex-grow transition-all hover:scale-y-110"
                   style={{ backgroundColor: COLORS[log.cognitive_state as keyof typeof COLORS] || '#1e293b' }}
                   title={`${log.domain} - ${log.cognitive_state} @ ${format(new Date(log.timestamp), 'HH:mm')}`}
                />
              ))}
              {timeline.length === 0 && <div className="w-full flex items-center justify-center text-slate-500 italic text-sm">Waiting for incoming logs...</div>}
           </div>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Detailed Cards */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard 
                title="Deep Work" 
                value={stats?.stats['Deep Work'] || 0} 
                unit="min" 
                icon={<Brain className="text-indigo-400" />} 
                color="border-indigo-500/40"
                desc="High focus investment."
                delay={0.1}
            />
            <MetricCard 
                title="Fragmented" 
                value={stats?.stats['Fragmented Attention'] || 0} 
                unit="min" 
                icon={<AlertTriangle className="text-amber-400" />} 
                color="border-amber-500/40"
                desc="Switching tax paid."
                delay={0.2}
            />
            <MetricCard 
                title="Focus Debt" 
                value={stats?.stats['Passive Consumption'] || 0} 
                unit="min" 
                icon={<Ghost className="text-rose-400" />} 
                color="border-rose-500/40"
                desc="Lost to algorithms."
                delay={0.3}
            />

            <section className="sm:col-span-3 glass-card p-8 min-h-[400px]">
              <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black mb-1 flex items-center gap-2">
                    <Activity className="text-yellow-400 w-6 h-6" />
                    Focus Distribution
                  </h2>
                  <p className="text-slate-500 text-sm">Aggregated cognitive load across categories.</p>
                </div>
                <div className="mt-6 md:mt-0 flex gap-6">
                    {Object.entries(COLORS).map(([name, color]) => (
                        <div key={name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{name}</span>
                        </div>
                    ))}
                </div>
              </div>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((_entry: any, index) => (
                        <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6 border-indigo-500/20 bg-indigo-500/5">
               <h2 className="text-xl font-bold mb-4">Ledger Analysis</h2>
               <div className="space-y-4">
                  <InsightItem 
                    title="Current Status"
                    text={stats?.roi > 50 ? "Your attention is generating dividends." : "High context switching detected."}
                    type={stats?.roi > 50 ? "success" : "warning"}
                  />
                  <InsightItem 
                     title="AI Tip"
                     text="Dedicate another 20min to your current deep work task to hit peak flow."
                     type="info"
                  />
               </div>
            </motion.section>

            <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity className="w-20 h-20" />
               </div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Focus Sources</h3>
               <div className="space-y-3">
                  {timeline.slice(-5).reverse().map((log, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white/5">
                      <span className="font-mono text-slate-300 truncate max-w-[120px]">{log.domain}</span>
                      <span className="px-2 py-0.5 rounded text-[10px]" style={{ color: COLORS[log.cognitive_state as keyof typeof COLORS] }}>{log.cognitive_state}</span>
                    </div>
                  ))}
               </div>
            </motion.section>

            <button className="w-full py-4 glass-card border-indigo-500/30 text-indigo-400 font-bold hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2 group">
              Export Statement
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const MetricCard = ({ title, value, unit, icon, color, desc, delay }: any) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }} 
    animate={{ y: 0, opacity: 1 }} 
    transition={{ delay }}
    className={`glass-card p-6 border-b-4 ${color} transition-all hover:translate-y-[-4px]`}
  >
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-slate-800/40 rounded-xl shadow-inner border border-white/5">{icon}</div>
      <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-5xl font-mono font-black tracking-tighter text-white">{value}</span>
      <span className="text-slate-500 text-sm font-bold uppercase">{unit}</span>
    </div>
    <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const InsightItem = ({ title, text, type }: any) => {
  const styles = {
    success: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-200',
    warning: 'border-rose-500/20 bg-rose-500/5 text-rose-200',
    info: 'border-slate-500/20 bg-slate-500/5 text-slate-300'
  };
  return (
    <div className={`p-4 rounded-xl border ${styles[type as keyof typeof styles]}`}>
      <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">{title}</p>
      <p className="text-sm font-medium leading-snug">{text}</p>
    </div>
  );
}

export default App;
