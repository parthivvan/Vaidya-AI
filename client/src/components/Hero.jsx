import React from 'react';
import { ShieldCheck, Clock, Activity } from 'lucide-react';

const FeatureItem = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-3 text-gray-600">
    <div className="bg-indigo-50 p-2 rounded-full">
      <Icon className="h-5 w-5 text-indigo-600" />
    </div>
    <span className="font-medium">{text}</span>
  </div>
);

const Hero = () => {
  return (
    <div className="hidden md:block pr-8">
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
        Healthcare Simplified with <br />
        <span className="text-indigo-600">Artificial Intelligence</span>
      </h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Experience the future of medical management. Secure patient portals, 
        smart scheduling, and AI-driven insights all in one place.
      </p>
      
      <div className="space-y-4">
        <FeatureItem icon={ShieldCheck} text="Bank-grade HIPAA Compliance" />
        <FeatureItem icon={Clock} text="24/7 Real-time Monitoring" />
        <FeatureItem icon={Activity} text="Smart Health Analytics" />
      </div>

      <div className="mt-12 p-6 bg-white rounded-2xl border border-indigo-50 shadow-sm inline-block">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Trusted By</p>
        <div className="flex space-x-6 opacity-60 grayscale hover:grayscale-0 transition-all">
          {/* Simple text placeholders for logos */}
          <span className="font-bold text-xl text-indigo-900">MayoClinic</span>
          <span className="font-bold text-xl text-blue-800">Cleveland</span>
          <span className="font-bold text-xl text-cyan-700">Hopkins</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;