import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../providers/AuthProvider";

type PrivateRouteProps = {
  redirectTo?: string;
  children?: React.ReactNode;
};
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  redirectTo = "/login",
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
