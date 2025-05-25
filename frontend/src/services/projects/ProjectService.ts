import { PaginatedResponse } from "../../types/paginated";
import { Project } from "../../types/project";
import {
  fetchWithAuth,
  toApiUrl,
  transferApiQueryParams,
} from "../../utils/api";

export const getProjects = async (userId: string, query?: string) => {
  const baseUrl = toApiUrl(`/users/${userId}/projects`);
  const response = await fetchWithAuth(
    transferApiQueryParams(query, baseUrl) || baseUrl
  );
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await response.json();
  return data as PaginatedResponse<Project>;
};

export const getProject = async (id: string) => {
  const response = await fetchWithAuth(toApiUrl(`/projects/${id}`));
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }
  const data = await response.json();
  return data as Project;
};
