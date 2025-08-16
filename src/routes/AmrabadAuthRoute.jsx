import React from 'react'
import { amrabadAuthStore } from '../store/amarabad/user/amrabadAuthStore';
import { Navigate } from 'react-router-dom';

const AmrabadAuthRoute = ({ element }) => {
    const { isAuthenticated } = amrabadAuthStore();
  
    return isAuthenticated ? <Navigate to="/amrabad" replace /> : element;
}

export default AmrabadAuthRoute
