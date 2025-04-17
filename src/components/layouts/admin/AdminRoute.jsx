import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdminAuthenticated } from '../../../utils/adminAuth';

export const AdminRoute = () => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}; 