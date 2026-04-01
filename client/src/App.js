import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  FileEdit, 
  Image as ImageIcon, 
  Settings2, 
  LogOut, 
  UserCircle2,
  Search,
  BellRing,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Compass,
  Command
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import MediaLibrary from "./pages/MediaLibrary";
import EditPost from "./pages/EditPost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import ReadPost from "./pages/ReadPost";

const SidebarItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 mb-2 font-bold ${
      active 
      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100'
    }`}
  >
    <Icon size={22} className={active ? 'text-indigo-400' : 'group-hover:text-indigo-600'} />
    <span className="tracking-tight">{label}</span>
    {active && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
  </Link>
);

const Navbar = () => (
  <header className="h-24 sticky top-0 z-40 bg-white/60 backdrop-blur-2xl border-b border-slate-100/50 flex items-center justify-between px-12">
    <div className="flex items-center gap-10">
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Lookup workspace..." 
          className="bg-slate-100/50 border border-slate-200/40 rounded-[2rem] py-3.5 pl-14 pr-8 text-sm focus:ring-8 focus:ring-slate-50 transition-all outline-none w-96 font-bold"
        />
      </div>
    </div>
    
    <div className="flex items-center gap-10">
      <div className="flex items-center gap-4">
        <button className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900 relative">
          <BellRing size={20} />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900">
          <Settings2 size={20} />
        </button>
      </div>

      <div className="h-10 w-[1px] bg-slate-100"></div>

      <div className="flex items-center gap-5">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] mb-1">Authenticated</p>
          <p className="text-sm font-black text-slate-900">Operator One</p>
        </div>
        <div className="h-14 w-14 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-xl shadow-indigo-100 group cursor-pointer transition-transform hover:scale-105 active:scale-95">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-900 border-2 border-white shadow-inner">
             <UserCircle2 size={32} strokeWidth={1.5} className="text-slate-300" />
          </div>
        </div>
      </div>
    </div>
  </header>
);

function AppContent() {
  const { token, logout } = useContext(AuthContext);
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen flex bg-slate-50/50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Premium Sidebar */}
      {token && !isAuthPage && (
        <motion.aside
          initial={{ x: -350 }}
          animate={{ x: 0 }}
          className="w-[22rem] bg-white border-r border-slate-100 p-10 flex flex-col fixed h-screen z-50"
        >
          <div className="flex items-center gap-4 mb-20 px-2 group cursor-pointer">
            <div className="w-14 h-14 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-2xl shadow-slate-300 transition-all group-hover:rotate-12 group-hover:scale-110">
              <Command className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-0.5">
                Content<span className="text-indigo-600">Flow</span>
              </h1>
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-300 ml-0.5">
                <ShieldCheck size={10} className="text-indigo-500" /> Enterprise v1.1
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-3">
            <div className="mb-10">
               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] px-5 mb-6">Main Console</p>
               <SidebarItem to="/" icon={BarChart3} label="Insights Hub" active={location.pathname === "/"} />
               <SidebarItem to="/create" icon={FileEdit} label="Creation Lab" active={location.pathname === "/create"} />
               <SidebarItem to="/media" icon={ImageIcon} label="Asset Storage" active={location.pathname === "/media"} />
               <SidebarItem to="/settings" icon={Settings2} label="System Config" active={location.pathname === "/settings"} />
            </div>
            
            <div>
               <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] px-5 mb-6">Discovery</p>
               <SidebarItem to="/trending" icon={Sparkles} label="Trending" active={location.pathname === "/trending"} />
               <SidebarItem to="/explore" icon={Compass} label="Global Feed" active={location.pathname === "/explore"} />
            </div>
          </nav>

          <button
            onClick={logout}
            className="flex items-center gap-4 px-8 py-5 rounded-[2rem] transition-all bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-black uppercase tracking-widest text-xs group shadow-sm hover:shadow-2xl hover:shadow-rose-100 border border-rose-100/50"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Terminate Session</span>
          </button>
        </motion.aside>
      )}

      {/* Primary Layout */}
      <div className={`flex-1 flex flex-col ${token && !isAuthPage ? 'ml-[22rem]' : ''}`}>
        {token && !isAuthPage && <Navbar />}
        
        <main className={`flex-1 ${!isAuthPage ? 'p-16' : 'p-0 flex items-center justify-center'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className={!isAuthPage ? "max-w-[100rem] mx-auto w-full" : "w-full flex items-center justify-center"}
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="/media" element={<ProtectedRoute><MediaLibrary /></ProtectedRoute>} />
                <Route path="/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/read/:id" element={<ProtectedRoute><ReadPost /></ProtectedRoute>} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;