import { createContext, useContext } from "react";
import { useState } from "react";
import { Outlet } from "react-router";

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthContext = createContext({
  isAuthenticated: false,
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
      <Outlet />
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
