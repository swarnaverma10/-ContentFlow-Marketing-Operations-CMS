import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api/config";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Copy,
  Filter,
  ArrowUpDown,
  BookOpen,
  ChevronLeft,
  MoreVertical,
  Zap
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="card group hover:scale-[1.02] active:scale-[0.98] p-8 shadow-xl shadow-slate-100/50">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{title}</p>
        <h3 className="text-4xl font-black text-slate-900">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1 mt-3 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full w-fit text-[10px] font-black border border-emerald-100">
            <TrendingUp size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-3xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform shadow-inner border border-${color}-100`}>
        <Icon size={28} />
      </div>
    </div>
  </div>
);

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [filterStatus, filterCategory, sortBy]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/posts?status=${filterStatus}&category=${filterCategory}&sort=${sortBy}`);
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/api/delete-post/${id}`);
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await axios.post(`${API_URL}/api/duplicate-post/${id}`);
      fetchPosts();
      alert("Post Cloned Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === "Published").length;
  const draftPosts = posts.filter(p => p.status === "Draft").length;
  const scheduledPosts = posts.filter(p => p.status === "Scheduled").length;

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Mock analytics data based on posts
  const getAnalyticsData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => ({
        name: day,
        posts: Math.floor(Math.random() * (posts.length || 5)),
        engagement: Math.floor(Math.random() * 100)
    }));
  };

  const chartData = getAnalyticsData();

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Insights Hub</h2>
          <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
            Overview of <span className="text-indigo-600 font-bold">{totalPosts}</span> curated publications
          </p>
        </div>
        <button 
          onClick={() => navigate("/create")}
          className="btn-primary flex items-center gap-3 px-10 py-5 shadow-2xl shadow-indigo-100 rounded-[2.5rem]"
        >
          <Plus size={24} />
          <span className="font-extrabold tracking-tight">Post New Content</span>
        </button>
      </div>

      {/* Analytics & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 card p-8 space-y-8 bg-white/50 backdrop-blur-sm border-slate-200/50">
            <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-lg font-black text-slate-900 tracking-tight">Publication Velocity</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Global activity across 7 standard solar days</p>
                </div>
                <div className="flex gap-2">
                   <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black border border-indigo-100 uppercase">Live Index</div>
                </div>
            </div>
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}}
                        />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 20px' }}
                            itemStyle={{ fontSize: '12px', fontWeight: '900', color: '#1e293b' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="posts" 
                            stroke="#4f46e5" 
                            strokeWidth={4} 
                            fillOpacity={1} 
                            fill="url(#colorPosts)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
            <StatCard title="Global Reach" value={totalPosts} icon={FileText} color="indigo" trend="+12% growth" />
            <StatCard title="Deployment Success" value={publishedPosts} icon={CheckCircle2} color="emerald" trend="+5.2%" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Draft Inventory" value={draftPosts} icon={Clock} color="rose" />
        <StatCard title="Future Queue" value={scheduledPosts} icon={ArrowUpDown} color="amber" />
        <div className="card bg-slate-900 border-slate-800 p-8 flex flex-col justify-between">
           <Zap className="text-amber-400 mb-6" size={30} />
           <div>
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Infrastructure</p>
             <h4 className="text-white font-black text-xl tracking-tight">Active Edge Nodes</h4>
             <p className="text-indigo-400 text-3xl font-black mt-2">147 <span className="text-xs text-slate-600 font-bold">Online</span></p>
           </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card p-4 flex flex-wrap items-center justify-between gap-6 bg-slate-50/50 border-slate-200/60 transition-all hover:shadow-xl">
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                <Filter size={18} className="text-slate-400" />
                <select 
                    className="bg-transparent border-none outline-none text-sm font-black text-slate-700 cursor-pointer min-w-[140px]"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">ALL DEPLOYMENTS</option>
                    <option value="Published">PUBLISHED</option>
                    <option value="Draft">DRAFT</option>
                    <option value="Scheduled">SCHEDULED</option>
                </select>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <MoreVertical size={18} className="text-slate-400" />
                <select 
                    className="bg-transparent border-none outline-none text-sm font-black text-slate-700 cursor-pointer min-w-[140px]"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">ALL THEMES</option>
                    <option value="General">GENERAL</option>
                    <option value="Marketing">MARKETING</option>
                    <option value="Technology">TECHNOLOGY</option>
                    <option value="Business">BUSINESS</option>
                </select>
            </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <ArrowUpDown size={18} className="text-slate-400" />
            <select 
                className="bg-transparent border-none outline-none text-sm font-black text-slate-700 cursor-pointer min-w-[140px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="newest">CHRONOLOGICAL (DESC)</option>
                <option value="oldest">CHRONOLOGICAL (ASC)</option>
                <option value="title">ALPHABETICAL</option>
            </select>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {currentPosts.map((post, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              key={post._id}
              className="card group hover:shadow-2xl hover:shadow-indigo-100 hover:border-indigo-200 p-3"
            >
              <div className="relative mb-6 overflow-hidden rounded-[2rem] aspect-[16/10] shadow-lg">
                {post.image ? (
                  <img
                    src={`${API_URL}/uploads/${post.image}`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                    <ImageIcon size={64} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 text-[10px] font-black rounded-xl uppercase tracking-widest backdrop-blur-md border ${
                    post.status === "Published" 
                    ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" 
                    : post.status === "Scheduled"
                    ? "bg-amber-500/20 text-amber-600 border-amber-500/30"
                    : "bg-rose-500/20 text-rose-600 border-rose-500/30"
                  }`}>
                    {post.status}
                  </span>
                  <span className="px-3 py-1 bg-white/50 backdrop-blur-md text-slate-900 text-[10px] font-black rounded-xl border border-white/20 uppercase tracking-widest">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="px-5 pb-5">
                  <div className="flex items-center gap-3 text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-3">
                    <BookOpen size={14} />
                    <span>{post.readingTime || 0} MIN READ</span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                    <span className="text-slate-400 capitalize">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <h4 className="font-black text-xl text-slate-900 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight">
                    {post.title}
                  </h4>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/edit/${post._id}`)}
                        className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 shadow-inner"
                        title="Edit Article"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDuplicate(post._id)}
                        className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 shadow-inner"
                        title="Duplicate (Clone)"
                      >
                        <Copy size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(post._id)}
                        className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 shadow-inner"
                        title="Archive/Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em] group/btn">
                      LIVE PREVIEW <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-10">
            <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-4 rounded-2xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-lg transition-all"
            >
                <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                            currentPage === i + 1 
                            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" 
                            : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-4 rounded-2xl border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-lg transition-all"
            >
                <ChevronRight size={20} />
            </button>
          </div>
      )}
    </div>
  );
}

export default Dashboard;