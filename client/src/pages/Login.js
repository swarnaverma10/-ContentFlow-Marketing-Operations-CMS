import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../api/config";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Key, Sparkles, AlertCircle } from "lucide-react";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            login(response.data.token);
            navigate("/");
        } catch (err) {
            console.error("Login component error:", err);
            setError(err.response?.data?.message || "Invalid Email or Password");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="auth-mesh-bg"></div>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-lg"
        >
            <div className="card shadow-2xl shadow-slate-900/10 p-12 border-none">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200 mb-6 group transition-transform hover:scale-110">
                            <Key className="text-white" size={32} />
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Welcome Back</h2>
                        <p className="text-slate-500 font-medium tracking-wide">Enter your credentials to access <span className="font-bold text-indigo-600">ContentFlow</span></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 outline-none font-medium"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 outline-none font-medium"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-rose-50 text-rose-600 text-sm font-semibold p-4 rounded-2xl border border-rose-100 flex items-center gap-3"
                            >
                                <AlertCircle size={20} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <LogIn size={20} className="text-amber-300" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-10 text-slate-500 font-bold">
                        New to ContentFlow?{" "}
                        <Link
                            to="/signup"
                            className="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4"
                        >
                            Request Access
                        </Link>
                    </p>

                    <div className="mt-12 flex justify-center gap-6 text-[10px] font-black uppercase text-slate-300 tracking-widest border-t border-slate-100 pt-8">
                        <Link to="#" className="hover:text-indigo-600">Privacy Protocol</Link>
                        <span className="w-1 h-1 bg-slate-200 rounded-full mt-1.5"></span>
                        <Link to="#" className="text-slate-300 hover:text-indigo-600">Compliance Terms</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;