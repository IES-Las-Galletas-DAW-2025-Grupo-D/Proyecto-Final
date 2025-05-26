import { RegisterRequest } from "../types/user.types";

export const register = async (params: RegisterRequest) => {
  const response = await fetch("/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Register failed");
  }

  return await response.json();
};