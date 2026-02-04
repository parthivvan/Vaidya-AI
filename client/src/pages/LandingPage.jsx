import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../components/AuthCard';
import PricingSection from '../components/PricingSection';

// Helper Icon Component
const Icon = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const LandingPage = () => {
  const { user } = useAuth();

  // Redirect if logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="font-display text-slate-900 antialiased bg-slate-50 overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      
      {/* --- BACKGROUND ACCENTS --- */}
      <div className="fixed top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[60px] pointer-events-none z-0"></div>
      <div className="fixed top-[40%] left-[-200px] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none z-0"></div>

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <Icon name="medical_services" className="text-[20px]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                MediFlow AI
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/health-hive" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Health Hive</Link>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Solutions</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Pricing</a>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full pt-12 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  New: AI Diagnostics V2.0
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Healthcare <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
                  Reimagined with AI
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Empower your practice with predictive analytics and automated workflows.
                Reduce administrative burden and focus on what matters most—patient care.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button className="h-12 px-8 rounded-lg bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  Request Demo <Icon name="arrow_forward" />
                </button>
                <button className="h-12 px-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Icon name="play_circle" className="text-primary" /> Watch Video
                </button>
              </div>
            </div>

            {/* Right Side: Auth Card */}
            <div className="relative w-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-indigo-500/20 rounded-full blur-3xl transform rotate-12"></div>
              <div className="relative z-10 w-full max-w-md">
                <AuthCard />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              Advanced Capabilities
            </span>
            <h2 className="text-4xl font-bold mt-4 mb-6">
              Designed for the Future of Medicine
            </h2>
            <p className="text-slate-600 text-lg">
              Seamlessly integrate AI into your healthcare workflow.
            </p>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION (INSERTED) --- */}
      <PricingSection />

      {/* --- TESTIMONIAL SECTION --- */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-slate-800 mb-8">
            "MediFlow AI has transformed how we manage patient intake."
          </blockquote>
          <div className="font-bold">Dr. Emily Chen</div>
          <div className="text-slate-500 text-sm">
            Chief of Medicine, Northside Clinic
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-16 pb-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © 2026 MediFlow AI. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
