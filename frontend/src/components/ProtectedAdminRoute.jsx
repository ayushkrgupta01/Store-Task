"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please login to access the admin panel", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingSpinner size="xl" text="Loading..." fullScreen={true} />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login page
  }

  return children;
};

export default ProtectedAdminRoute;
