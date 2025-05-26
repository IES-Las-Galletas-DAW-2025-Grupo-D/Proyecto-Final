import { PaginatedResponse } from "../../types/paginated";
import { Project, ProjectCreate } from "../../types/project";
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

export const createProject = async (
  userId: string,
  projectData: ProjectCreate
) => {
  const response = await fetchWithAuth(toApiUrl(`/users/${userId}/projects`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    throw new Error("Failed to create project");
  }
  const data = await response.json();
  return data as Project;
};

export const inviteToProject = async (
  userId: number,
  projectId: number,
  roleName: string
) => {
  const response = await fetchWithAuth(
    toApiUrl(`/projects/${projectId}/users/${userId}/roles/${roleName}/invite`),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    let message;

    try {
      const errorData = await response.json();
      message = errorData.message || "Failed to invite user to project";
    } catch {
      message = "Failed to invite user to project";
    }

    throw new Error(message);
  }
  const data = await response.json();
  return data as Project;
};

export const acceptProjectInvitation = async (
  userId: number,
  projectId: number
) => {
  const response = await fetchWithAuth(
    toApiUrl(`/projects/${projectId}/users/${userId}`),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    let message;

    try {
      const errorData = await response.json();
      message = errorData.message || "Failed to accept project invitation";
    } catch {
      message = "Failed to accept project invitation";
    }

    throw new Error(message);
  }
  const data = await response.json();
  return data as Project;
};

export const declineProject = async (userId: number, projectId: number) => {
  const response = await fetchWithAuth(
    toApiUrl(`/projects/${projectId}/users/${userId}/invite`),
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    let message;

    try {
      const errorData = await response.json();
      message = errorData.message || "Failed to decline project invitation";
    } catch {
      message = "Failed to decline project invitation";
    }

    throw new Error(message);
  }
  return true;
};
