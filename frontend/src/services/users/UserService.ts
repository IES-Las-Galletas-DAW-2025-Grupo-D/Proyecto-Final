import { fetchWithAuth, toApiUrl } from "../../utils/api";

export const usernameExists = async (username: string): Promise<boolean> => {
  const response = await fetch(toApiUrl(`/users/${username}/exists`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to check username existence");
  }

  const result = await response.text();
  return result.trim() === "true";
};

export const getUserByUsername = async (username: string) => {
  const response = await fetchWithAuth(toApiUrl(`/users/${username}/user`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user by username");
  }

  const user = await response.json();
  return user;
};
