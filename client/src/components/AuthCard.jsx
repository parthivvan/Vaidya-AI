import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

// ✅ UNCOMMENTED & ACTIVE
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 🧠 SMART REDIRECT LOGIC ---
  // --- 🧠 SMART REDIRECT (HARD RELOAD FIX) ---
  const handleSmartRedirect = (role) => {
    // ⚠️ Using window.location.href forces a hard browser navigation
    // This prevents React Router from getting confused
    if (role === 'doctor') {
      window.location.href = "/doctor-dashboard";
    } else if (role === 'admin') {
      window.location.href = "/admin-dashboard";
    } else {
      window.location.href = "/dashboard";
    }
  };

  // --- 📧 EMAIL LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        toast.success("Welcome back!");
        handleSmartRedirect(data.user.role);
      } else {
        toast.error(data.message || "Login Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  // --- 🌐 GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      // 1. Trigger Firebase Popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Firebase User:", user.email); // Debug Log

      // 2. Send to Backend
      const res = await fetch("http://localhost:5001/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: user.displayName,
          email: user.email,
          googlePhotoUrl: user.photoURL
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        toast.success("Google Login Successful!");
        handleSmartRedirect(data.user.role);
      } else {
        toast.error("Google Auth Failed on Server");
      }

    } catch (error) {
      console.error("Google Error:", error);
      toast.error("Google Sign-In Cancelled");
    } finally {
      setLoading(false);
    }
  };

  // --- 📝 REGISTER ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created! Please log in.");
        setIsLogin(true);
      } else {
        toast.error(data.message || "Registration Failed");
      }
    } catch (error) {
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 p-6 text-center border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          {isLogin ? "Enter your credentials" : "Join MediFlow AI today"}
        </p>
      </div>

      <div className="p-8">
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text" name="fullName" placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 outline-none"
                  value={formData.fullName} onChange={handleChange} required
                />
              </div>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="email" name="email" placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 outline-none"
                value={formData.email} onChange={handleChange} required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="password" name="password" placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 outline-none"
                value={formData.password} onChange={handleChange} required
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <> {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-5 h-5" /> </>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3 text-slate-400 text-sm font-medium">OR</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        {/* 🟢 REAL GOOGLE BUTTON */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Sign in with Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            <button onClick={() => setIsLogin(!isLogin)} className="ml-2 font-bold text-primary hover:underline">
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;