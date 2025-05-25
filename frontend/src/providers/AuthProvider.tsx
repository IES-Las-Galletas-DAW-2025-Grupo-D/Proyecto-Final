import React, { createContext, useContext, useEffect, useState } from "react";
import { LoginRequest } from "../types/user.types";
import { login as loginService } from "../services/LoginService";

interface AuthContextType {
  isAuthenticated: () => boolean;
  isTokenExpired: () => boolean;
  getUserId: () => string | null;
  getUserName: () => string | null;
  getToken: () => string | null;
  login: (loginRequest: LoginRequest) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (loginRequest: LoginRequest) => {
    try {
      const { token } = await loginService(loginRequest);
      setToken(token);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const isAuthenticated = () => {
    return !!token && !isTokenExpired();
  };

  const isTokenExpired = () => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  const getUserId = () => {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const getUserName = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.name;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const getToken = () => {
    if (!token) return null;
    return token;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isTokenExpired,
        getUserId,
        getUserName,
        getToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
