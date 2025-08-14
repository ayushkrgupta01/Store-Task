"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on component mount
    const adminToken = localStorage.getItem('adminToken');
    const adminInfo = localStorage.getItem('adminInfo');
    
    // Also check for cookie
    const cookies = document.cookie.split(';');
    const adminTokenCookie = cookies.find(cookie => cookie.trim().startsWith('adminToken='));
    
    if ((adminToken && adminInfo) || adminTokenCookie) {
      setIsAuthenticated(true);
      if (adminInfo) {
        setAdminData(JSON.parse(adminInfo));
      }
    }
    setLoading(false);
  }, []);

  const login = (adminInfo, token) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
    
    // Set cookie for server-side authentication
    document.cookie = `adminToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    
    setIsAuthenticated(true);
    setAdminData(adminInfo);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    
    // Remove cookie
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    setIsAuthenticated(false);
    setAdminData(null);
  };

  const value = {
    isAuthenticated,
    adminData,
    loading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
