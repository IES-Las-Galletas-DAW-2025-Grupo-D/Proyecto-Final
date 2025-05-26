export interface Project {
  id: number;
  name: string;
  description: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
}