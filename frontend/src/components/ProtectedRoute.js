// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth(); // will NOT be undefined if wrapped
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
export default ProtectedRoute;
