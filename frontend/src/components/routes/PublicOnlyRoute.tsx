import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../providers/AuthProvider";

type PublicOnlyRouteProps = {
  redirectTo?: string;
  children?: React.ReactNode;
};
export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
  redirectTo = "/dashboard",
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated()) {
    const from =
      location.state?.from?.pathname + (location.state?.from?.search || "");
    const destination =
      from && from != "undefined" && from !== location.pathname
        ? from
        : redirectTo;
    console.log("PublicOnlyRoute: redirecting to", destination);
    return <Navigate to={destination} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
