import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard'; // 👈 CRITICAL IMPORT
import Pharmacy from './pages/Pharmacy';
import CartPage from './pages/CartPage';
import HealthHiveLanding from './pages/HealthHiveLanding';

// Context & Protection
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" />
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/health-hive" element={<HealthHiveLanding />} />

        {/* Patient Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* 👨‍⚕️ DOCTOR DASHBOARD (The Route we were missing/breaking) */}
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        {/* Pharmacy */}
        <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />

        {/* Cart */}
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />

        {/* Catch-all: If page doesn't exist, go home */}
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;