import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token, loading, isApproved, isPending } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Verifying Department Credentials...
      </div>
    );
  }

  // Not logged in or missing token
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is an unapproved owner trying to access protected owner features
  if (user.role === 'OWNER' && isPending) {
    return <Navigate to="/pending-approval" replace />;
  }

  // Role check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    switch (user.role) {
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      case 'LMO':
        return <Navigate to="/lmo" replace />;
      case 'GATC':
        return <Navigate to="/gatc" replace />;
      case 'OWNER':
      default:
        return <Navigate to="/owner" replace />;
    }
  }

  return children;
};
