import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../core/services/AuthService";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      console.warn("User should login to access this page.");
      alert("⚠️ You must be logged in to view this page.");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    // Redirect to home if not logged in
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
