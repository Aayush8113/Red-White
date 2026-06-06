import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../state/authStore";

export function ProtectedRoute({ children, adminOnly = false, role = null }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(user?.role?.toLowerCase())) {
      return <Navigate to="/" replace />;
    }
  }


  return children;
}

