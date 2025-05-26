import { Project } from "./project";
import { ProjectRole } from "./projectRole.enum";
import { User } from "./user";

export interface Notification {
  id: number;
  username: string;
  eventName: string;
  data: Data;
  timestamp: Date;
  readStatus: boolean;
}

export interface Data {
  id: number;
  invitedUser: User;
  inviterUser: User;
  project: Project;
  projectRole: ProjectRole;
  createdAt: Date;
}
