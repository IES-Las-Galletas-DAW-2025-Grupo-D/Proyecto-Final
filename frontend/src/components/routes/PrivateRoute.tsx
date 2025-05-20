import React from "react";
import { Navigate, Outlet, useLocation } from "react-router"; // useLocation is needed
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
  const location = useLocation(); // Get the current location

  if (!isAuthenticated()) {
    // Pass the current location in the state object
    // This allows the login page or subsequent logic to redirect back
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render children if provided, otherwise render the Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};
