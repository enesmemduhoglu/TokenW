import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const AdminProtectedRoute = ({ element: Component, ...rest }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/adminLogin" />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/adminLogin" />;
  }

  return <Component {...rest} />;
};

export default AdminProtectedRoute;
