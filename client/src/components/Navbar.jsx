import React from 'react';
import { Activity } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-indigo-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            MediFlow AI
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Home</a>
          <a href="#" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Services</a>
          <a href="#" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Doctors</a>
          <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-medium hover:bg-indigo-100 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;