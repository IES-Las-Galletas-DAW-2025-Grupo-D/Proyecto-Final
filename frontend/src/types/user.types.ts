export type LoginResponse = {
  token: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};
