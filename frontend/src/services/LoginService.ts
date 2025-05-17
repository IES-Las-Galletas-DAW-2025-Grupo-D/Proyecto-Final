import { LoginRequest, LoginResponse } from "../types/user.types";

export const login = async (params: LoginRequest) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  return data as LoginResponse;
};