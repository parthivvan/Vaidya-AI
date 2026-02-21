import React from 'react';
import { 
  Activity, 
  Check, 
  CheckCircle2, 
  HeartPulse, 
  BrainCircuit, 
  Sparkles, 
  Minus, 
  Building2, 
  Stethoscope, 
  Heart, 
  FlaskConical 
} from 'lucide-react';

const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden bg-slate-50">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-blue-50 to-purple-50 rounded-full blur-[100px] -z-10 opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-semibold text-primary">Simple, transparent pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Predictable Plans for <br className="hidden sm:block"/> <span className="text-primary">Indian Healthcare</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Scale your medical practice with trusted AI. Plans tailored for clinics, solo practitioners, and hospitals across India.
          </p>
        </div>

        {/* Billing Toggle (Visual Only) */}
        <div className="mb-16">
          <div className="relative flex items-center p-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="absolute left-1.5 w-[calc(50%-6px)] h-[calc(100%-12px)] bg-slate-100 rounded-lg shadow-inner transition-all duration-300 ease-out translate-x-0"></div>
            <button className="relative z-10 flex-1 px-6 py-2 text-sm font-semibold text-slate-900 transition-colors">Monthly</button>
            <button className="relative z-10 flex-1 px-6 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Yearly <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-1 font-bold">-20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-stretch">
          
          {/* Plan 1: Pulse (Free) */}
          <div className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900">Pulse</h3>
                <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-primary transition-colors">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <p className="text-slate-500 text-sm h-10">Essential tools for solo practitioners just getting started.</p>
            </div>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">₹0</span>
              <span className="text-slate-500 font-medium">/mo</span>
            </div>
            <div className="flex flex-col gap-4 mb-8 flex-1">
              {['Patient Booking System', 'Basic Patient History', 'Email Support (48h)', 'Secure Data Storage'].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <button className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:text-primary hover:border-primary/30">
              Get Started Free
            </button>
          </div>

          {/* Plan 2: Vitals+ (Most Popular) */}
          <div className="group relative flex flex-col rounded-2xl border-2 border-primary bg-white p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 z-10 ring-4 ring-primary/5">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
              Most Popular
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900">Vitals+</h3>
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <HeartPulse className="w-6 h-6" />
                </div>
              </div>
              <p className="text-slate-500 text-sm h-10">Advanced AI features for growing clinics and teams.</p>
            </div>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-slate-900">₹799</span>
              <span className="text-slate-400 font-medium">/mo</span>
            </div>
            <div className="flex flex-col gap-4 mb-8 flex-1">
              {['Everything in Pulse', 'AI Symptom Checker', 'WhatsApp Reminders', '24/7 Priority Chat', 'Custom Branding'].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <button className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-indigo-700 hover:shadow-primary/40">
              Upgrade to Vitals+
            </button>
          </div>

          {/* Plan 3: Neuro AI (Pro) */}
          <div className="group relative flex flex-col rounded-2xl p-[1px] bg-gradient-to-br from-primary to-purple-500 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col h-full w-full rounded-2xl bg-white/90 backdrop-blur-xl p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Neuro AI</h3>
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-slate-500 text-sm h-10">Full-context intelligence for enterprise healthcare.</p>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">₹1,499</span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>
              <div className="flex flex-col gap-4 mb-8 flex-1">
                {['Everything in Vitals+', 'RAG Chatbot (Full Context)', 'Predictive Health Analytics', 'Dedicated API Access', 'SLA & Enterprise Security'].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <Sparkles className="w-5 h-5 text-purple-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full rounded-xl border border-purple-200 bg-purple-50 py-3 text-sm font-bold text-purple-700 transition-all hover:bg-purple-100 hover:border-purple-300">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="w-full max-w-7xl mt-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Compare Plans</h3>
            <p className="text-slate-500 max-w-xl mx-auto">Detailed breakdown of features across all plans.</p>
          </div>
          
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-6 bg-slate-50/50 border-b border-slate-200 min-w-[200px]">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Features</span>
                    </th>
                    <th className="p-6 bg-slate-50/50 border-b border-slate-200 text-center w-1/4">
                      <span className="text-lg font-bold text-slate-900 block mb-1">Pulse</span>
                      <span className="text-xs font-medium text-slate-500">Free</span>
                    </th>
                    <th className="p-6 bg-primary/5 border-b border-slate-200 text-center w-1/4">
                      <span className="text-lg font-bold text-primary block mb-1">Vitals+</span>
                      <span className="text-xs font-medium text-slate-500">₹799</span>
                    </th>
                    <th className="p-6 bg-slate-50/50 border-b border-slate-200 text-center w-1/4">
                      <span className="text-lg font-bold text-purple-600 block mb-1">Neuro AI</span>
                      <span className="text-xs font-medium text-slate-500">₹1,499</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Core Features */}
                  <tr><td className="bg-slate-50 px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider" colSpan="4">Core Features</td></tr>
                  <TableRow name="Booking System" pulse={true} plus={true} pro={true} />
                  <TableRow name="History Storage" pulse="Basic (1GB)" plus="Advanced (50GB)" pro="Unlimited" isText={true} />
                  <TableRow name="Custom Branding" pulse={false} plus={true} pro={true} />
                  
                  {/* AI Capabilities */}
                  <tr><td className="bg-slate-50 px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider" colSpan="4">AI Capabilities</td></tr>
                  <TableRow name="Symptom Checker" pulse={false} plus={true} pro={true} />
                  <TableRow name="RAG Chatbot" pulse={false} plus={false} pro={true} />
                  <TableRow name="SMS Reminders" pulse={false} plus={true} pro={true} />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="mt-20 w-full pt-8 border-t border-slate-200/60 text-center">
          <p className="text-sm font-medium text-slate-400 mb-8 uppercase tracking-wider">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <LogoItem icon={Building2} name="Apollo Hospitals" />
            <LogoItem icon={Stethoscope} name="Fortis" />
            <LogoItem icon={Heart} name="Narayana Health" />
            <LogoItem icon={FlaskConical} name="Dr. Lal PathLabs" />
          </div>
        </div>

      </div>
    </section>
  );
};

// Helper Components to keep code clean
const TableRow = ({ name, pulse, plus, pro, isText = false }) => (
  <tr className="group hover:bg-slate-50/50 transition-colors">
    <td className="px-6 py-4 text-sm font-medium text-slate-700">{name}</td>
    <td className="px-6 py-4 text-center">
      {isText ? <span className="text-sm text-slate-500">{pulse}</span> : (pulse ? <Check className="w-5 h-5 text-primary mx-auto" /> : <Minus className="w-5 h-5 text-slate-300 mx-auto" />)}
    </td>
    <td className="px-6 py-4 text-center bg-primary/[0.02]">
      {isText ? <span className="text-sm font-medium text-slate-900">{plus}</span> : (plus ? <Check className="w-5 h-5 text-primary mx-auto" /> : <Minus className="w-5 h-5 text-slate-300 mx-auto" />)}
    </td>
    <td className="px-6 py-4 text-center">
      {isText ? <span className="text-sm font-medium text-slate-900">{pro}</span> : (pro ? <Check className="w-5 h-5 text-primary mx-auto" /> : <Minus className="w-5 h-5 text-slate-300 mx-auto" />)}
    </td>
  </tr>
);

const LogoItem = ({ icon: Icon, name }) => (
  <div className="flex items-center gap-2 text-slate-700 font-bold text-lg">
    <Icon className="w-5 h-5" /> {name}
  </div>
);

export default PricingSection;