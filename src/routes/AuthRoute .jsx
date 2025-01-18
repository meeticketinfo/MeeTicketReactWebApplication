import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AuthRoute = ({ element }) => {
  const { isAuthenticated } = useAuthStore();
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : element;
};

export default AuthRoute;
