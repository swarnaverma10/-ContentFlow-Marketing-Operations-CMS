import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_URL from "../api/config";
import RichTextEditor from "../components/RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import slugify from "react-slugify";
import { 
  Send, 
  ImageIcon, 
  X, 
  UploadCloud, 
  Globe, 
  Type,
  Layout,
  Tag,
  FolderOpen,
  Calendar,
  Clock,
  Save,
  Trash2,
  Link
} from "lucide-react";

function CreatePost() {
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
  const [lastSaved, setLastSaved] = useState(null);

  // READING TIME ESTIMATOR
  const estimateReadingTime = useCallback((text) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }, []);

  const readingTime = estimateReadingTime(content);

  // AUTO-SAVE DRAFT (Local Storage)
  useEffect(() => {
    const savedDraft = localStorage.getItem("post-draft");
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setTitle(draft.title || "");
      setSlug(draft.slug || "");
      setContent(draft.content || "");
      setCategory(draft.category || "General");
      setTags(draft.tags || []);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const draft = { title, slug, content, category, tags };
      localStorage.setItem("post-draft", JSON.stringify(draft));
      setLastSaved(new Date().toLocaleTimeString());
    }, 2000);
    return () => clearTimeout(timeout);
  }, [title, slug, content, category, tags]);

  // AUTO SLUG GENERATION
  useEffect(() => {
    if (title && !slug) {
        setSlug(slugify(title));
    }
  }, [title, slug]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (t) => setTags(tags.filter(tag => tag !== t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("slug", slug);
      formData.append("status", status);
      formData.append("category", category);
      formData.append("tags", JSON.stringify(tags));
      if (status === "Scheduled" && scheduledDate) formData.append("scheduledDate", scheduledDate);
      formData.append("readingTime", readingTime || 0);
      if (metaTitle) formData.append("metaTitle", metaTitle);
      if (metaDescription) formData.append("metaDescription", metaDescription);
      if (image) formData.append("image", image);

      await axios.post(`${API_URL}/api/create-post`, formData);
      alert("Post Created Successfully ✅");
      localStorage.removeItem("post-draft");
      window.location.href = "/";
    } catch (error) {
      console.error("Submission Error Details:", error.response?.data || error);
      alert(`Error creating post: ${error.response?.data?.error || error.message || "Unknown Error"}`);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    if (window.confirm("Clear all drafting?")) {
        setTitle(""); setContent(""); setSlug(""); setTags([]); setStatus("Draft");
        localStorage.removeItem("post-draft");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Compose Entry</h2>
            {lastSaved && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100 animate-in fade-in transition-all">
                    <Save size={12} /> Auto-saved {lastSaved}
                </div>
            )}
          </div>
          <p className="text-slate-500 font-medium ml-1 flex items-center gap-2">
            Draft your masterpiece. <span className="w-1 h-1 bg-slate-300 rounded-full"></span> 
            <Clock size={16} className="text-indigo-500" /> <span className="font-bold text-indigo-600">{readingTime} min read</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={clearForm}
            className="p-3 rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm"
            title="Clear Draft"
          >
            <Trash2 size={22} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary flex items-center gap-3 px-8 py-4 text-lg"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={22} />
                <span>Publish Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3 space-y-10">
          {/* Main Title Card */}
          <div className="card space-y-8 p-10 shadow-2xl shadow-indigo-100/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Type size={16} className="text-indigo-500" /> Title of the Article
                </label>
                <span className="text-[10px] font-bold text-slate-300">{title.length} characters</span>
              </div>
              <input
                type="text"
                placeholder="Hook the reader with a catchy title..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl py-6 px-8 text-3xl font-black text-slate-900 placeholder-slate-300 focus:ring-8 focus:ring-indigo-50 transition-all outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Link size={16} className="text-indigo-500" /> URL Destination (Slug)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 font-bold text-sm bg-slate-100 rounded-l-2xl border-r border-slate-200 px-4">
                  contentflow.com/
                </div>
                <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl py-4 pl-40 pr-6 text-indigo-600 font-bold focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Layout size={16} className="text-indigo-500" /> Content Architect
              </label>
              <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-inner bg-slate-50/20">
                <RichTextEditor value={content} onChange={setContent} />
              </div>
            </div>
          </div>

          {/* Tags & Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 block flex items-center gap-2">
                    <FolderOpen size={16} className="text-blue-500" /> Article Category
                </label>
                <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
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
                    <Tag size={16} className="text-violet-500" /> Searchable Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                    <AnimatePresence>
                        {tags.map(t => (
                            <motion.span 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                key={t} 
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black flex items-center gap-1.5 border border-indigo-100 group"
                            >
                                #{t}
                                <button onClick={() => removeTag(t)} className="opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </div>
                <input 
                    type="text" 
                    placeholder="Type tag and press Enter..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-violet-50 focus:border-violet-500 transition-all outline-none"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                />
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Status & Schedule */}
          <div className="card p-8 bg-indigo-600 border-none shadow-2xl shadow-indigo-200">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                <Globe size={18} className="text-indigo-200" /> Publication Engine
            </h3>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest ml-1">Current State</label>
                    <select 
                        className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-white font-black focus:ring-4 focus:ring-white/10 outline-none cursor-pointer"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Draft" className="text-slate-900">Draft Status</option>
                        <option value="Published" className="text-slate-900">Live Release</option>
                        <option value="Scheduled" className="text-slate-900">Advanced Schedule</option>
                    </select>
                </div>

                {status === "Scheduled" && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="space-y-2"
                    >
                        <label className="text-[10px] font-black text-indigo-200 uppercase tracking-widest ml-1">Release Date & Time</label>
                        <div className="relative">
                            <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50" />
                            <input 
                                type="datetime-local" 
                                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-14 pr-6 text-white font-bold text-sm focus:ring-4 focus:ring-white/10 outline-none"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                            />
                        </div>
                    </motion.div>
                )}
            </div>
          </div>

          {/* Featured Image */}
          <div className="card p-8">
            <div className="flex items-center gap-2 text-amber-500 mb-6 px-1">
              <ImageIcon size={20} />
              <span className="text-[11px] font-black uppercase tracking-widest">Main Header Image</span>
            </div>
            
            <div className={`relative group border-4 border-dashed ${preview ? 'border-indigo-100' : 'border-slate-100'} rounded-[2.5rem] p-4 transition-all hover:bg-slate-50 overflow-hidden`}>
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Hero" className="w-full aspect-[4/3] object-cover rounded-[2rem] shadow-xl" />
                    <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-[2rem]">
                      <button type="button" onClick={() => { setImage(null); setPreview(null); }} className="p-4 bg-white rounded-2xl text-indigo-600 shadow-2xl hover:scale-110 active:scale-95 transition-all">
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                      <UploadCloud size={40} />
                    </div>
                    <p className="text-sm font-black text-slate-900">Drop your file</p>
                    <p className="text-xs font-bold text-slate-400 mt-2">Maximum 5MB · PNG/WEBP</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
            </div>
          </div>

          {/* SEO Optimization */}
          <div className="card p-8 space-y-8">
            <div className="flex items-center gap-2 text-emerald-500 px-1">
              <Globe size={20} />
              <span className="text-[11px] font-black uppercase tracking-widest">SEO Optimization</span>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meta Title</label>
                    <input 
                        type="text" 
                        placeholder="Google Search Title..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-4 focus:ring-emerald-50 outline-none"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meta Description</label>
                    <textarea 
                        placeholder="Brief summary for search engines..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-4 focus:ring-emerald-50 outline-none min-h-[80px]"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                    />
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Google Result Preview</p>
                    <div className="space-y-1">
                        <cite className="text-[10px] text-slate-400 not-italic flex items-center gap-1">contentflow.com › {slug || '...'}</cite>
                        <h4 className="text-[#1a0dab] text-lg hover:underline cursor-pointer font-medium leading-tight">{metaTitle || title || 'New Article Title'}</h4>
                        <p className="text-[#4d5156] text-xs leading-relaxed line-clamp-2">{metaDescription || 'Add a meta description to see how your article appears in global search results.'}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;