import React, { useState, useEffect } from "react";
import { 
  Palette, 
  ShieldCheck, 
  BellRing, 
  Globe, 
  Image as ImageIcon, 
  Save, 
  Command,
  Type,
  Cpu,
  Zap,
  Lock,
  Moon,
  Activity
} from "lucide-react";

const Toggle = ({ active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-14 h-7 rounded-full transition-all relative ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}
  >
    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${active ? 'left-8' : 'left-1'}`} />
  </button>
);

function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [siteName, setSiteName] = useState("ContentFlow CMS");
  const [brandColor, setBrandColor] = useState("#4f46e5");
  const [tagline, setTagline] = useState("Next-gen Content Management");
  const [preview, setPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // New Enhanced States
  const [darkMode, setDarkMode] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [apiKey, setApiKey] = useState("••••••••••••••••");

  useEffect(() => {
    const saved = localStorage.getItem("site-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSiteName(parsed.siteName || "ContentFlow CMS");
      setBrandColor(parsed.brandColor || "#4f46e5");
      setTagline(parsed.tagline || "");
      setDarkMode(parsed.darkMode || false);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem("site-settings", JSON.stringify({ siteName, brandColor, tagline, darkMode }));
      setIsSaving(false);
    }, 1200);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setPreview(URL.createObjectURL(file));
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all border ${
        activeTab === id 
        ? "bg-slate-900 text-white shadow-xl shadow-slate-200 border-slate-900" 
        : "bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:border-slate-100"
      }`}
    >
      <Icon size={20} className={activeTab === id ? "text-indigo-400" : ""} /> {label}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Command Center</h2>
          <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
            <Activity size={16} className="text-indigo-500" />
            Control global parameters, AI intelligence, and platform branding.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-4 px-10 py-5 rounded-[2.5rem] shadow-2xl shadow-indigo-100 relative overflow-hidden group"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={22} className="group-hover:scale-110 transition-transform" />
              <span className="font-black tracking-tight">Deploy Configuration</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Rail */}
        <div className="lg:col-span-3 space-y-4">
            <TabButton id="general" label="Site Identity" icon={Globe} />
            <TabButton id="appearance" label="Visual Engine" icon={Palette} />
            <TabButton id="ai" label="AI Cognition" icon={Cpu} />
            <TabButton id="security" label="Permissions" icon={ShieldCheck} />
            <TabButton id="infra" label="Infrastructure" icon={Zap} />
            <TabButton id="notifications" label="Communications" icon={BellRing} />
            
            <div className="mt-12 p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100/50">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Storage Quota</p>
               <div className="w-full h-2 bg-indigo-100 rounded-full mb-3 overflow-hidden">
                  <div className="w-2/3 h-full bg-indigo-600 rounded-full" />
               </div>
               <p className="text-[10px] font-bold text-indigo-600">6.4GB / 10GB (Scale Plan)</p>
            </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "general" && (
                <div className="space-y-10">
                    <div className="card p-10 space-y-10">
                        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Command size={18} /> Basic Meta Infrastructure
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Name</label>
                                <div className="relative group">
                                    <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                    <input 
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] py-4 pl-14 pr-6 font-bold text-slate-900 focus:ring-8 focus:ring-indigo-50 focus:border-indigo-400 transition-all outline-none"
                                        value={siteName}
                                        onChange={(e) => setSiteName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Tagline</label>
                                <input 
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] py-4 px-6 font-bold text-slate-900 focus:ring-8 focus:ring-indigo-50 focus:border-indigo-400 transition-all outline-none"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card p-10 space-y-10">
                        <h3 className="text-xs font-black text-amber-600 uppercase tracking-[0.3em] flex items-center gap-3">
                            <ImageIcon size={18} /> Brand Heritage Assets
                        </h3>
                        <div className="flex items-center gap-12 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 shadow-inner">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-white flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden group relative">
                                {preview ? (
                                    <img src={preview} alt="Logo" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                ) : (
                                    <Command size={50} className="text-slate-100" />
                                )}
                            </div>
                            <div className="flex-1 space-y-5">
                                <h4 className="text-lg font-black text-slate-900">Workspace Master Key (Logo)</h4>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm">This asset will be reflected across all sidebar headers, favicon, and automated emails.</p>
                                <div className="flex items-center gap-4">
                                  <label className="cursor-pointer px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                                      Upload Master Image
                                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                  </label>
                                  <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs font-black hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all">Reset Heritage</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "appearance" && (
                <div className="space-y-10">
                    <div className="card p-10 space-y-10">
                        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Palette size={18} /> Visual Engine Config
                        </h3>
                        <div className="space-y-12">
                            <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
                                        <Moon size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900">Dark Interface Protocol</p>
                                        <p className="text-xs text-slate-400 font-bold">Optimized for nighttime content creation sessions.</p>
                                    </div>
                                </div>
                                <Toggle active={darkMode} onClick={() => setDarkMode(!darkMode)} />
                            </div>

                            <div className="space-y-6">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Fluid Brand Identity (HEX Code)</label>
                                <div className="flex items-center gap-8">
                                    <div className="w-20 h-20 rounded-[1.8rem] border-8 border-white shadow-2xl transition-all hover:scale-110" style={{ backgroundColor: brandColor }} />
                                    <div className="flex-1 relative">
                                        <input 
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] py-5 px-8 font-black text-indigo-600 text-xl focus:ring-8 focus:ring-indigo-50 outline-none"
                                            value={brandColor}
                                            onChange={(e) => setBrandColor(e.target.value)}
                                        />
                                        <input 
                                            type="color"
                                            className="w-10 h-10 rounded-full cursor-pointer opacity-0 absolute right-6 top-1/2 -translate-y-1/2"
                                            value={brandColor}
                                            onChange={(e) => setBrandColor(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "ai" && (
                <div className="space-y-10">
                  <div className="card p-10 space-y-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Cpu size={18} /> Cognitive Engine (AI)
                        </h3>
                        <Toggle active={aiEnabled} onClick={() => setAiEnabled(!aiEnabled)} />
                    </div>

                    <div className={`space-y-8 transition-all ${aiEnabled ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <Zap className="text-indigo-500" size={30} />
                                <h4 className="font-black text-slate-900">Neural Assist</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Enable predictive text, auto-tagging, and sentiment analysis for all content drafts.</p>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <Activity className="text-emerald-500" size={30} />
                                <h4 className="font-black text-slate-900">Smart Meta-Gen</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Automatically generate SEO meta-descriptions based on real-time article analysis.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                              <Lock size={14} className="text-indigo-400" /> Gemini Pro API Token
                            </label>
                            <div className="relative group">
                              <input 
                                type="password"
                                className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] py-5 px-8 font-bold text-slate-900 focus:ring-8 focus:ring-indigo-50 outline-none"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                              />
                            </div>
                            <p className="text-[10px] font-medium text-slate-400 px-4 mt-2">Tokens are encrypted and stored in a secure hardware enclave. Never shared.</p>
                        </div>
                    </div>
                  </div>
                </div>
            )}

            {activeTab === "security" && (
                <div className="space-y-10">
                    <div className="card p-10 space-y-10">
                        <h3 className="text-xs font-black text-rose-600 uppercase tracking-[0.3em] flex items-center gap-3">
                            <ShieldCheck size={18} /> Access Protocols
                        </h3>
                        
                        <div className="space-y-6">
                            {[
                                { role: "Master Admin", users: 1, access: "Full Control", color: "indigo" },
                                { role: "Chief Editor", users: 3, access: "Review & Publish", color: "emerald" },
                                { role: "Staff Architect", users: 12, access: "Draft Only", color: "orange" }
                            ].map((role, idx) => (
                                <div key={idx} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-${role.color}-50 flex items-center justify-center text-${role.color}-600 border border-${role.color}-100 shadow-inner group-hover:scale-110 transition-transform`}>
                                            <Lock size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900">{role.role}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{role.access} · {role.users} Active Terminals</p>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">Configure IAM</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
