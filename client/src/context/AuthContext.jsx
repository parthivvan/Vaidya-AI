import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. On App Start: Check if user is already logged in
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // Clean up corrupt data
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // 2. Login Function (Saves Data)
  const login = (token, userData) => {
    console.log("🔐 Saving User to Context:", userData); // DEBUG LOG
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 3. Logout Function
  const logout = async () => {
    // 🟢 Tell the backend the user is leaving
    if (user && user.id) {
      try {
        await fetch("http://localhost:5001/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id })
        });
      } catch (err) {
        console.error("Failed to update offline status");
      }
    }

    // Clear local data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/"; // Force redirect to home
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);