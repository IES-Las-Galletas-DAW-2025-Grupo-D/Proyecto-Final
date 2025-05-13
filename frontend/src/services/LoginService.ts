import { LoginRequest, LoginResponse } from "../types/user.types";

export const login = async (params: LoginRequest) => {
  const response = await fetch("https://36666632-8d59-4989-87d7-a0fc1fc32957.mock.pstmn.io/api/v1/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  return data as LoginResponse;
};