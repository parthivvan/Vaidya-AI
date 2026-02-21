import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 👈 Import Auth
import { 
  Activity, Search, ShoppingBag, PlayCircle, Check, 
  Stethoscope, ShieldCheck, Lock, Shield, Pill, 
  Microscope, Apple, Video, User, Brain, ArrowRight, 
  ArrowLeft, ArrowUpRight, Zap, Globe, Mail, LayoutDashboard
} from 'lucide-react';

const HealthHiveLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 👈 Get current user state

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#4f46e5]/20 overflow-x-hidden">
      {/* INJECT FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        
        .glass-nav {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* NAVBAR */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 border-b border-slate-100 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f46e5] to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-lg font-display font-bold tracking-tight text-slate-900">Health Hive</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Marketplace', 'Consultations', 'Labs', 'Enterprise'].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-slate-600 hover:text-[#4f46e5] transition-colors font-body">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex text-slate-600 hover:text-[#4f46e5] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/cart')} className="relative text-slate-600 hover:text-[#4f46e5] transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
            
            {/* 🟢 DYNAMIC AUTH BUTTON */}
            {user ? (
                // IF LOGGED IN: Show Dashboard Button + Avatar
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="bg-slate-900 text-white hover:bg-slate-800 pl-4 pr-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-[#4f46e5]/10 font-body flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#4f46e5] flex items-center justify-center text-[10px] border border-white/20">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                  Dashboard
                </button>
            ) : (
                // IF LOGGED OUT: Show Sign In
                <button 
                  onClick={() => navigate('/login')} 
                  className="bg-slate-900 text-white hover:opacity-90 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-[#4f46e5]/10 font-body"
                >
                  Sign In
                </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-10 px-6 text-center overflow-hidden">
        {/* Abstract Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4f46e5]/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-5xl mx-auto flex flex-col items-center gap-8 z-10 relative">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-4 font-body">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Ecosystem V2.0 Live
          </span>
          
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-slate-900">
            Unified <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] via-purple-500 to-indigo-600">
              Healthcare.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed font-light mt-4 font-body">
            The world's first fully integrated medical marketplace. From diagnostics to delivery, experience healthcare without friction.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 font-body">
            {/* 🟢 UPDATED: Explore Button Checks Auth */}
            <button 
                onClick={() => navigate('/pharmacy')} 
                className="bg-slate-900 text-white hover:opacity-90 px-10 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2"
            >
              Explore Ecosystem
            </button>
            <button className="bg-white text-slate-900 hover:bg-slate-50 px-10 py-4 rounded-full text-lg font-medium transition-all flex items-center gap-2 border border-slate-200">
              <PlayCircle className="w-5 h-5" /> Watch Keynote
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-5xl mt-16 md:mt-20 aspect-[16/9] group perspective-1000">
          <div 
            className="relative w-full h-full bg-cover bg-center rounded-2xl shadow-2xl transition-transform duration-700 ease-out hover:scale-[1.02]" 
            style={{ backgroundImage: "url('')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-20"></div>
            
            {/* Floating Card 1 */}
            <div className="absolute top-10 right-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Check className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Status</p>
                  <p className="font-bold text-slate-900">All Systems Optimal</p>
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Providers</p>
                  <p className="font-bold text-slate-900">12,000+ Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8 font-body">Trusted by Global Health Standards</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {[
              { icon: ShieldCheck, text: "HIPAA Compliant" },
              { icon: Lock, text: "ISO 27001" },
              { icon: Activity, text: "FDA Approved" },
              { icon: Shield, text: "GDPR Ready" }
            ].map((trust, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600">
                <trust.icon className="w-8 h-8" />
                <span className="font-display font-bold text-xl">{trust.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="py-24 md:py-32 px-6 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Complete Marketplace</h2>
              <p className="text-lg text-slate-500 max-w-lg font-body">Everything you need for comprehensive care, organized in an intelligent grid.</p>
            </div>
            <a href="#" className="group flex items-center gap-2 text-[#4f46e5] font-bold hover:text-indigo-500 transition-colors font-body">
               View All Categories <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-display">
            {/* Featured Pharmacy Card */}
            <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 min-h-[400px] hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute p-10 flex flex-col h-full justify-between z-10">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm mb-6">
                    <Pill className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Pharmacy & Medicines</h3>
                  <p className="text-slate-500 max-w-sm font-body">Prescription delivery in under 2 hours. AI-verified interactions.</p>
                </div>
                <button onClick={() => navigate('/pharmacy')} className="w-fit bg-white/80 backdrop-blur-sm text-slate-900 px-6 py-3 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Shop Pharmacy
                </button>
              </div>
              <div 
                className="absolute -right-20 -bottom-20 w-80 h-80 bg-contain bg-no-repeat opacity-80 group-hover:scale-110 transition-transform duration-700" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=500')", transform: 'rotate(-15deg)' }}
              ></div>
            </div>

            {/* Small Cards */}
            {[
              { title: "Smart Devices", sub: "Wearables & Monitors", icon: Activity, color: "text-blue-600", bg: "bg-blue-100" },
              { title: "Home Diagnostics", sub: "Lab tests at home", icon: Microscope, color: "text-purple-600", bg: "bg-purple-100" },
              { title: "First Aid", sub: "Emergency essentials", icon: Stethoscope, color: "text-red-600", bg: "bg-red-100" },
              { title: "Supplements", sub: "Vitamins & minerals", icon: Apple, color: "text-green-600", bg: "bg-green-100" }
            ].map((card, i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="text-slate-300 group-hover:text-[#4f46e5] transition-colors w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 font-body">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI PLATFORM SECTION */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="hidden lg:block relative">
            <div className="sticky top-32">
              <h2 className="font-display text-5xl font-bold tracking-tight text-slate-900 mb-6">Smart Platform. <br/>Intelligent Care.</h2>
              <p className="text-lg text-slate-500 mb-10 max-w-sm font-body">
                Advanced algorithms meet human expertise. Our platform adapts to your health needs in real-time.
              </p>
              <div className="space-y-6 font-display">
                {[
                  { text: "AI Symptom Checker", active: true },
                  { text: "Verified Pharmacists", active: false },
                  { text: "Instant Consultation", active: false }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 ${item.active ? 'text-[#4f46e5] font-bold' : 'text-slate-400 font-medium hover:text-slate-600'} transition-colors cursor-pointer`}>
                    <div className={`w-1 h-12 ${item.active ? 'bg-[#4f46e5]' : 'bg-slate-200'} rounded-full`}></div>
                    <span className="text-xl">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-32">
             {/* Feature 1 */}
             <div className="flex flex-col gap-6">
               <div className="aspect-video bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-xl text-white overflow-hidden relative group">
                 <Brain className="w-32 h-32 opacity-20 group-hover:scale-110 transition-transform duration-700 absolute" />
                 <div className="relative z-10 text-center p-8">
                   <Brain className="w-16 h-16 mx-auto mb-4" />
                   <h3 className="text-2xl font-bold font-display">Neural Analysis</h3>
                 </div>
               </div>
               <div className="lg:hidden">
                 <h3 className="text-2xl font-bold mb-2 text-slate-900">AI Symptom Checker</h3>
                 <p className="text-slate-500">Instant triage using 15M+ data points.</p>
               </div>
             </div>

             {/* Feature 2 */}
             <div className="flex flex-col gap-6">
               <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-xl text-white overflow-hidden relative group">
                 <ShieldCheck className="w-32 h-32 opacity-20 group-hover:scale-110 transition-transform duration-700 absolute" />
                 <div className="relative z-10 text-center p-8">
                   <ShieldCheck className="w-16 h-16 mx-auto mb-4" />
                   <h3 className="text-2xl font-bold font-display">Human Verification</h3>
                 </div>
               </div>
               <div className="lg:hidden">
                 <h3 className="text-2xl font-bold mb-2 text-slate-900">Verified Pharmacists</h3>
                 <p className="text-slate-500">Every order double-checked by licensed pros.</p>
               </div>
             </div>

             {/* Feature 3 */}
             <div className="flex flex-col gap-6">
               <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center shadow-xl text-white overflow-hidden relative group">
                 <Video className="w-32 h-32 opacity-20 group-hover:scale-110 transition-transform duration-700 absolute" />
                 <div className="relative z-10 text-center p-8">
                   <User className="w-16 h-16 mx-auto mb-4" />
                   <h3 className="text-2xl font-bold font-display">Live Connect</h3>
                 </div>
               </div>
               <div className="lg:hidden">
                 <h3 className="text-2xl font-bold mb-2 text-slate-900">Doctor Consultation</h3>
                 <p className="text-slate-500">Video call a specialist in under 10 minutes.</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* TRENDING PRODUCTS (Horizontal Scroll) */}
      <section className="py-24 px-6 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto mb-10 flex justify-between items-end">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Trending Now</h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"><ArrowRight className="w-5 h-5" /></button>
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-8 pb-10 hide-scrollbar px-6 lg:px-[max(0px,calc(50vw-40rem))]">
          {[
            { name: "Advanced Sanitizer", cat: "Hygiene", price: "₹12.00", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400" },
            { name: "Pure Zinc Complex", cat: "Supplements", price: "₹24.50", img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400" },
            { name: "Smart BP Monitor", cat: "Devices", price: "₹89.00", img: "https://images.unsplash.com/photo-1576091160550-2187d80aeff2?auto=format&fit=crop&q=80&w=400" },
            { name: "Infrared Thermometer", cat: "Devices", price: "₹45.00", img: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc55a?auto=format&fit=crop&q=80&w=400" }
          ].map((prod, i) => (
             <div key={i} className="min-w-[300px] md:min-w-[380px] group cursor-pointer" onClick={() => navigate('/pharmacy')}>
                <div className="aspect-[4/5] bg-slate-50 rounded-3xl relative overflow-hidden flex items-center justify-center mb-4">
                  <div className="absolute inset-0 bg-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img src={prod.img} alt={prod.name} className="w-48 h-48 object-contain transition-transform duration-500 group-hover:scale-110 mix-blend-multiply" />
                  <button className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-20">
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">{prod.name}</h3>
                <p className="text-slate-500 text-sm font-body">{prod.cat} • {prod.price}</p>
             </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 pt-20 pb-10 px-6 border-t border-slate-200 font-body">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded bg-[#4f46e5] flex items-center justify-center text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold font-display text-slate-900">Health Hive</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs mb-6">
                 The future of unified healthcare. An ecosystem built for accuracy, speed, and trust.
              </p>
              <div className="flex gap-4">
                <a className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:bg-black transition-colors" href="#"><Globe className="w-4 h-4" /></a>
                <a className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:bg-black transition-colors" href="#"><Mail className="w-4 h-4" /></a>
              </div>
            </div>
            
            {[
              { title: "Marketplace", links: ["Medicines", "Devices", "Lab Tests", "Supplements"] },
              { title: "Services", links: ["Tele-consult", "Home Care", "Enterprise"] },
              { title: "Company", links: ["About Us", "Careers", "Trust & Safety"] }
            ].map((col, i) => (
              <div key={i} className="flex flex-col gap-4">
                <h4 className="font-bold text-slate-900">{col.title}</h4>
                {col.links.map(link => (
                  <a key={link} href="#" className="text-slate-500 text-sm hover:text-[#4f46e5] transition-colors">{link}</a>
                ))}
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 gap-4">
            <p className="text-slate-400 text-xs">© 2026 Health Hive Ecosystem. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Sitemap"].map(item => (
                 <a key={item} className="text-slate-400 text-xs hover:text-slate-900" href="#">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HealthHiveLanding;