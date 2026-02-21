import React from 'react';
import Navbar from '../components/Navbar';
import AuthCard from '../components/AuthCard';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <AuthCard />
      </div>
    </div>
  );
};

export default LoginPage;