import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../api/config";
import { motion } from "framer-motion";
import { User, Mail, Lock, Sparkles, ShieldCheck } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setStrength(score);
  };

  const handleChange = (e) => {
    if (e.target.name === "password") checkStrength(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, formData);
      console.log("Registration Successful:", response.data);
      alert("Registration Successful! Now please login.");
      navigate("/login");
    } catch (err) {
      console.log("Full Registration Error Context:", err);
      if (err.response?.status === 400 && err.response?.data?.keyPattern?.email) {
          setError("Email is already registered. Please try a different one.");
      } else if (err.code === "ERR_NETWORK") {
          setError(`Cannot connect to server at ${API_URL}. Check if your backend is running.`);
      } else {
          setError(err.response?.data?.message || err.message || "Something went wrong. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="auth-mesh-bg"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <div className="card shadow-2xl shadow-slate-900/10 p-12 border-none">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200 mb-6 group transition-transform hover:rotate-6">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Create Account</h2>
            <p className="text-slate-500 font-medium tracking-wide">Join <span className="font-bold text-indigo-600">ContentFlow</span> workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 outline-none font-medium"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 outline-none font-medium"
                  onChange={handleChange}
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
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 outline-none font-medium"
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                  <div className="px-1 space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-slate-400">Entropy Score</span>
                          <span className={`text-[10px] font-black uppercase ${
                              strength === 0 ? "text-rose-500" :
                              strength <= 2 ? "text-amber-500" :
                              "text-emerald-500"
                          }`}>
                              {strength === 0 ? "Critical" : strength <= 2 ? "Moderate" : "Strong Shell"}
                          </span>
                      </div>
                      <div className="flex gap-1.5 h-1">
                          {[...Array(4)].map((_, i) => (
                              <div 
                                  key={i} 
                                  className={`flex-1 rounded-full transition-all duration-500 ${
                                      i < strength 
                                      ? (strength <= 2 ? "bg-amber-400" : "bg-emerald-500") 
                                      : "bg-slate-200"
                                  }`}
                              />
                          ))}
                      </div>
                  </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-rose-50 text-rose-600 text-sm font-semibold p-4 rounded-2xl border border-rose-100 flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
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
                  Register Now <Sparkles size={20} className="text-amber-300" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-slate-500 font-bold">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-200 underline-offset-4"
            >
              Sign In to Workspace
            </Link>
          </p>

          <p className="text-center mt-8 text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 opacity-50">
            <ShieldCheck size={12} className="text-emerald-500" /> Secure Protocol v2.4
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

export default Signup;
