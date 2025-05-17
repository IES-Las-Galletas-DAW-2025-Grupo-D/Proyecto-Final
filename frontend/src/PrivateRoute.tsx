import { Navigate } from "react-router";
import { useAuth } from "./providers/AuthProvider";

import React from "react";

interface PrivateRouteProps {
  children: React.ReactElement;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" />;
}