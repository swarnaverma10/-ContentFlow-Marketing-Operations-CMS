import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api/config";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Image as ImageIcon, 
  Download, 
  MoreVertical, 
  LayoutGrid, 
  List,
  Plus,
  ArrowRight,
  Filter,
  FileBadge
} from "lucide-react";

function MediaLibrary() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const images = posts.filter(p => 
    p.image && p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Media Storage</h2>
          <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
            Centralized repository for <span className="font-bold text-indigo-600">{images.length}</span> visual assets
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={20} />
              </button>
           </div>
           <button className="btn-primary flex items-center gap-2 py-4 px-8 shadow-xl shadow-indigo-100">
              <Plus size={20} /> <span className="font-black">New Asset</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search via filename or post title..." 
            className="w-full bg-white border border-slate-200 rounded-3xl py-4 pl-14 pr-8 text-sm font-bold focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="lg:col-span-2 flex items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-500 font-bold text-sm">
                <Filter size={18} /> Filter Status
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-3xl border border-slate-200 shadow-sm text-slate-500 font-bold text-sm">
                <FileBadge size={18} /> Storage Optimization
            </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {images.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-24 bg-slate-50/50 border-dashed border-slate-300"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-inner border border-slate-100">
              <ImageIcon size={48} />
            </div>
            <h3 className="text-slate-900 font-black text-2xl tracking-tight">Zero Assets Identified</h3>
            <p className="text-slate-400 font-medium max-w-sm mx-auto mt-3">Upload your first image within an article to populate the centralized media cloud.</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}
          >
            {images.map((post, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={post._id}
                className={`card p-3 group border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-50/50 ${viewMode === 'list' ? 'flex items-center gap-6' : ''}`}
              >
                <div className={`relative overflow-hidden rounded-[2rem] shadow-sm ${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square mb-4'}`}>
                  <img
                    src={`${API_URL}/uploads/${post.image}`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                    <button className="p-3 bg-white rounded-2xl text-indigo-600 hover:scale-110 transition-transform">
                      <Download size={20} />
                    </button>
                    <button className="p-3 bg-white/20 rounded-2xl text-white hover:scale-110 transition-transform backdrop-blur-xl">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="px-3 flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-black text-slate-900 truncate tracking-tight">{post.image.split('-').slice(1).join('-')}</h4>
                    {viewMode === 'grid' && <span className="p-1 px-2 bg-slate-50 text-[10px] font-black text-slate-400 rounded-lg uppercase">WEBP</span>}
                  </div>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.2em] line-clamp-1">{post.title}</p>
                </div>
                
                {viewMode === 'list' && (
                  <div className="flex items-center gap-8 pr-6 text-slate-400 font-bold text-xs">
                     <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                     <ArrowRight size={16} />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MediaLibrary;