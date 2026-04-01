import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../api/config";
import { AuthContext } from "../context/AuthContext";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Tag, 
  User, 
  Share2, 
  Bookmark,
  MessageSquare,
  ThumbsUp,
  Layout,
  ExternalLink,
  Edit3
} from "lucide-react";
import { motion } from "framer-motion";

const ReadPost = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/post/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPost(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError("Failed to load the post. It might have been deleted.");
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium animate-pulse">Retrieving your content...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20 px-6">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-100">
                    <Layout size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Post Not Found</h2>
                <p className="text-slate-500 mb-10 text-lg leading-relaxed">{error}</p>
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Insights Hub
                </Link>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto pb-24"
        >
            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-12">
                <button 
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-3 px-5 py-3 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:shadow-lg transition-all">
                        <Share2 size={20} />
                    </button>
                    <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:shadow-lg transition-all">
                        <Bookmark size={20} />
                    </button>
                    <Link 
                        to={`/edit/${post._id}`}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        <Edit3 size={18} />
                        Edit Article
                    </Link>
                </div>
            </div>

            {/* Post Metadata Hero */}
            <div className="mb-12">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        post.status === 'Published' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                        {post.status}
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {post.category || 'General'}
                    </span>
                    <div className="h-4 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                        <Clock size={16} />
                        {post.readingTime || 5} min read
                    </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {post.title}
                </h1>

                <div className="flex items-center gap-6 border-y border-slate-100 py-6 my-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white ring-4 ring-slate-50">
                            <User size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-0.5">Author</p>
                            <p className="text-sm font-black text-slate-900">Administrator</p>
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-100"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Calendar size={22} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-0.5">Published</p>
                            <p className="text-sm font-black text-slate-900">
                                {new Date(post.createdAt).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            {post.image && (
                <div className="mb-16 border-4 border-white shadow-2xl shadow-indigo-100/50 rounded-[3rem] overflow-hidden group">
                    <img 
                        src={`${API_URL}/uploads/${post.image}`} 
                        alt={post.title} 
                        className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
            )}

            {/* Content Body */}
            <div className="prose prose-lg max-w-none prose-slate prose-headings:font-black prose-headings:tracking-tighter prose-p:leading-relaxed prose-p:text-slate-600 prose-img:rounded-3xl prose-a:text-indigo-600 prose-strong:text-slate-900 mb-20">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags section */}
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-12 border-t border-slate-100 mb-16">
                    {post.tags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all cursor-default group">
                            <Tag size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            {tag}
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Interaction */}
            <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 opacity-20 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600 opacity-10 blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-center md:text-left">
                        <h3 className="text-3xl font-black mb-3 tracking-tight">Was this article helpful?</h3>
                        <p className="text-slate-400 font-medium">Your feedback helps us create better content for the community.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/5 rounded-2xl font-bold transition-all backdrop-blur-md">
                            <ThumbsUp size={20} />
                            Applaud
                        </button>
                        <button className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 hover:bg-indigo-50 rounded-2xl font-bold transition-all shadow-xl shadow-black/20">
                            <MessageSquare size={20} />
                            Comment
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReadPost;
