import { PaginatedResponse } from "../../types/paginated";
import { Project } from "../../types/project";
import {
  fetchWithAuth,
  toApiUrl,
  transferApiQueryParams,
} from "../../utils/api";

export const getProjects = async (url?: string) => {
  const mockResponse: PaginatedResponse<Project> = {
    total: 5,
    per_page: 3,
    current_page: 1,
    last_page: 2,
    first_page_url: null,
    last_page_url: "something",
    next_page_url: "something",
    prev_page_url: null,
    path: "/projects",
    from: 1,
    to: 3,
    data: [
      {
        id: 1,
        name: "Project One",
        description: "Mock project one description",
      },
      {
        id: 2,
        name: "Project Two",
        description: "Mock project two description",
      },
      {
        id: 3,
        name: "Project Three",
        description: "Mock project three description",
      },
    ],
  };

  return mockResponse;

  const baseUrl = toApiUrl("/projects");
  const response = await fetchWithAuth(
    transferApiQueryParams(url, baseUrl) || baseUrl
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
