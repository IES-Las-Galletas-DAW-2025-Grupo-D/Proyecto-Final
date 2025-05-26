import { RegisterRequest } from "../types/user";
import { toApiUrl } from "../utils/api";

export const register = async (params: RegisterRequest) => {
  const response = await fetch(toApiUrl("/auth/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();

    return error;
  }

  return null;
};
