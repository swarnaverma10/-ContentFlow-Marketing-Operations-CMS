import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API_URL from "../api/config";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

const AnalayticStat = ({ title, value, sub, icon: Icon, color }) => (
  <div className="card p-8 group hover:scale-[1.02] transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
        <h4 className="text-4xl font-black text-slate-900 mb-1">{value}</h4>
        <p className="text-xs font-bold text-slate-500">{sub}</p>
      </div>
      <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

function Analytics() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Calculate Velocity (Posts per day/category)
  const categories = ["General", "Marketing", "Technology", "Business", "Design"];
  const velocityData = categories.map(cat => ({
    name: cat,
    count: posts.filter(p => p.category === cat).length
  }));

  const total = posts.length;
  const published = posts.filter(p => p.status === "Published").length;
  const withImage = posts.filter(p => p.image).length;
  const avgReadingTime = total > 0 ? (posts.reduce((acc, p) => acc + (p.readingTime || 0), 0) / total).toFixed(1) : 0;

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             Intelligence Console <Sparkles className="text-amber-400" />
          </h2>
          <p className="text-slate-500 font-medium mt-1">Cross-platform publication velocity and engagement metrics.</p>
        </div>
        <div className="px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            Live Analytics Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnalayticStat title="Aggregate Output" value={total} sub="Total Articles" icon={FileText} color="indigo" />
        <AnalayticStat title="Live Deployment" value={published} sub="Published Live" icon={TrendingUp} color="emerald" />
        <AnalayticStat title="Media Density" value={withImage} sub="Posts with Visuals" icon={Users} color="blue" />
        <AnalayticStat title="Avg Depth" value={`${avgReadingTime}m`} sub="Estimated Read Time" icon={Clock} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 card p-10 space-y-10">
           <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Category Distribution</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Allocation across primary themes</p>
           </div>
           
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 900}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={40}>
                    {velocityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#4f46e5', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="card bg-slate-900 border-none p-10 flex flex-col justify-between overflow-hidden relative group">
           <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700" />
           <div className="relative z-10">
              <div className="p-4 bg-indigo-500/20 rounded-2xl w-fit text-indigo-400 mb-8 border border-white/10">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-4">Enterprise<br/>Growth Report</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">Your content ecosystem has grown by <span className="text-emerald-400 font-black">+24%</span> since the last synchronization epoch.</p>
           </div>
           
           <button className="relative z-10 w-full py-5 bg-white rounded-2xl text-slate-900 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-500 hover:text-white transition-all shadow-2xl">
              Export Intelligence <ArrowUpRight size={18} />
           </button>
        </div>
      </div>
    </div>
  );
}

export default Analytics;