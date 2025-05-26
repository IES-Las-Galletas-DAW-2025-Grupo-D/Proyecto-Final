import { Role } from "./role.enum";

export type LoginResponse = {
  token: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  roles: Role[];
}
