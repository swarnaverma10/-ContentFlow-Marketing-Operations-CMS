import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, 
  Image as ImageIcon, 
  X, 
  UploadCloud, 
  Search, 
  Globe, 
  Type,
  Layout,
  Tag,
  FolderOpen,
  Calendar,
  Clock,
  ArrowLeft,
  Link
} from "lucide-react";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("Draft");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const estimateReadingTime = useCallback((text) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }, []);

  const readingTime = estimateReadingTime(content);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/posts");
        const post = res.data.find(p => p._id === id);

        if (post) {
          setTitle(post.title || "");
          setContent(post.content || "");
          setSlug(post.slug || "");
          setStatus(post.status || "Draft");
          setCategory(post.category || "General");
          setTags(post.tags || []);
          setScheduledDate(post.scheduledDate ? post.scheduledDate.substring(0, 16) : "");
          setMetaTitle(post.metaTitle || "");
          setMetaDescription(post.metaDescription || "");
          if (post.image) setPreview(`http://127.0.0.1:5000/uploads/${post.image}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);
      formData.append("category", category);
      formData.append("tags", JSON.stringify(tags));
      if (status === "Scheduled") formData.append("scheduledDate", scheduledDate);
      formData.append("readingTime", readingTime);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      if (image) formData.append("image", image);

      await axios.put(`http://127.0.0.1:5000/api/update-post/${id}`, formData);
      alert("Post Synchronized Successfully ✅");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Synchronization failure");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (t) => setTags(tags.filter(tag => tag !== t));

  if (fetching) return (
    <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-indigo-600 transition-colors mb-4 group">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Terminal
           </button>
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">Modify Publication</h2>
           <p className="text-slate-500 font-medium ml-1 flex items-center gap-2">
            Last updated <span className="font-bold text-indigo-600">{new Date().toLocaleDateString()}</span>
           </p>
        </div>
        <button
            onClick={handleUpdate}
            disabled={loading}
            className="btn-primary flex items-center gap-3 px-8 py-4 text-lg bg-slate-900 hover:bg-black shadow-xl shadow-slate-200"
        >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={22} />
                <span>Save Changes</span>
              </>
            )}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3 space-y-10">
          <div className="card space-y-8 p-10 shadow-2xl shadow-indigo-100/30">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Type size={16} className="text-indigo-500" /> Article Title
              </label>
              <input
                type="text"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl py-6 px-8 text-3xl font-black text-slate-900 placeholder-slate-300 focus:ring-8 focus:ring-indigo-50 transition-all outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Layout size={16} className="text-indigo-500" /> Content Editor
              </label>
              <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-inner bg-slate-50/20">
                <RichTextEditor value={content} onChange={setContent} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 block flex items-center gap-2">
                    <FolderOpen size={16} className="text-blue-500" /> Assignment Category
                </label>
                <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option>General</option>
                    <option>Marketing</option>
                    <option>Technology</option>
                    <option>Design</option>
                    <option>Business</option>
                </select>
            </div>

            <div className="card p-8">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 block flex items-center gap-2">
                    <Tag size={16} className="text-violet-500" /> Metadata Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map(t => (
                        <span key={t} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black flex items-center gap-1.5 border border-indigo-100 group">
                            #{t}
                            <button onClick={() => removeTag(t)} className="opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                        </span>
                    ))}
                </div>
                <input 
                    type="text" 
                    placeholder="Add tags..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-violet-50 transition-all outline-none"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                />
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="card p-8 bg-black border-none shadow-2xl">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                <Globe size={18} className="text-white/50" /> System State
            </h3>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Current Visibility</label>
                    <select 
                        className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-white font-black focus:ring-4 focus:ring-white/10 outline-none cursor-pointer"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Draft" className="text-slate-900">Archived (Draft)</option>
                        <option value="Published" className="text-slate-900">Active (Live)</option>
                        <option value="Scheduled" className="text-slate-900">Pending (Scheduled)</option>
                    </select>
                </div>
                {status === "Scheduled" && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Scheduled Release</label>
                        <input 
                            type="datetime-local" 
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-white font-bold text-sm focus:ring-4 focus:ring-white/10 outline-none"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                        />
                    </div>
                )}
            </div>
          </div>

          <div className="card p-8">
            <div className="flex items-center gap-2 text-amber-500 mb-6">
              <ImageIcon size={20} />
              <span className="text-[11px] font-black uppercase tracking-widest">Post Imagery</span>
            </div>
            
            <div className="relative group border-4 border-dashed border-slate-100 rounded-[2.5rem] p-4 transition-all hover:bg-slate-50 overflow-hidden">
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Hero" className="w-full aspect-[4/3] object-cover rounded-[2rem] shadow-xl" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-[2rem]">
                      <button type="button" onClick={() => { setImage(null); setPreview(null); }} className="p-4 bg-white rounded-2xl text-slate-900 border-none shadow-2xl hover:scale-110 active:scale-95 transition-all">
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                      <UploadCloud size={40} />
                    </div>
                    <p className="text-sm font-black text-slate-900">Replace image</p>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { 
                        setImage(e.target.files[0]); 
                        setPreview(URL.createObjectURL(e.target.files[0])); 
                    }} />
                  </label>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPost;