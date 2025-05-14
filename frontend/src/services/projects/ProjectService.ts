import { PaginatedResponse } from "../../types/paginated";
import { Project } from "../../types/project";

export const getProjects = async (url?: string) => {
  const response = await fetch("https://36666632-8d59-4989-87d7-a0fc1fc32957.mock.pstmn.io/api/v1/user/1/projects");
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await response.json();
  return data as PaginatedResponse<Project>;
}