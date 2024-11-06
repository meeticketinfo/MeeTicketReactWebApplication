import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  //   if (isAuthenticated) {
  //     return <Navigate to="/dashboard" replace />;
  //   }

  return element;
};

export default ProtectedRoute;
