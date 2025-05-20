import { LoginRequest, LoginResponse } from "../types/user.types";
import { toApiUrl } from "../utils/api";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await fetch(toApiUrl("/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid credentials");
      } else if (response.status === 422 && data.errors) {
        throw new Error(
          `Validation failed: ${Object.values(data.errors).flat().join(", ")}`
        );
      } else if (data.message) {
        throw new Error(data.message);
      } else {
        throw new Error(`Login failed with status: ${response.status}`);
      }
    }

    return data as LoginResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
};
