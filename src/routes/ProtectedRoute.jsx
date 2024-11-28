import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import {
  superAdminPermissions,
  parkAdminPermissions,
  nodalOfficerPermissions,
} from "../constants/permissions";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, roleDetails } = useAuthStore();
  const location = useLocation();

  const role = roleDetails?.name;

  const rolePermissions = useMemo(() => {
    if (role === "ROLE_SUPERADMIN") {
      return superAdminPermissions;
    } else if (role === "ROLE_ADMIN") {
      return parkAdminPermissions;
    } else if (role === "ROLE_NODALOFFICER") {
      return nodalOfficerPermissions;
    }
    return [];
  }, [role]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  //   if (isAuthenticated) {
  //     return <Navigate to="/dashboard" replace />;
  //   }
  // Get current route and check if it is allowed for the user's role
  const currentPath = location.pathname.replace(/\/$/, ""); // Normalize trailing slash
  const permissions = rolePermissions || [];
  const isAuthorized = permissions.some((route) =>
    currentPath.startsWith(`/${route}`)
  );

  // Redirect to a "Not Authorized" page if the route is not allowed
  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute;
