import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { amrabadAuthStore } from "../store/amarabad/user/amrabadAuthStore";

const AmrabadProtectRoute = ({ element }) => {
  const { isAuthenticated } = amrabadAuthStore();
  const location = useLocation();

  // If authenticated and on login page, redirect to dashboard
  if (isAuthenticated && location.pathname === "/amrabad/login") {
    return <Navigate to="/amrabad" replace />;
  }

  // If not authenticated, redirect to login and preserve the intended path
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/amrabad/login"
        replace
        state={{ from: location }} // ✅ pass current location for redirection after login
      />
    );
  }
  return element;
};

export default AmrabadProtectRoute;
