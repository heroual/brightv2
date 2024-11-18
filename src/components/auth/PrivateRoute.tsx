import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  role?: 'doctor' | 'patient';
}

export default function PrivateRoute({ children, role }: PrivateRouteProps) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  if (role && userProfile?.role !== role) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}