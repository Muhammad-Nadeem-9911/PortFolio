import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAdminAuthenticated = !!localStorage.getItem('authToken'); // Changed to 'authToken'

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children; // This will render <AdminLayout /> in your App.js setup
};

export default PrivateRoute;
