import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../../services/authService';

const PrivateRoute = ({ element }) => {
  // If authorized, return the element (the component for the protected route)
  // Otherwise, return element that will navigate to login page
  return isLoggedIn() ? element : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;