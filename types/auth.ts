export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateRequest = {
  name: string;
  lastname: string;
  email: string;
};

export interface SignupResponse {
  email: string;
  name: string;
  token: string;
  refreshToken: string;
}

export interface MeResponse {
  email: string;
  name: string;
  token: string;
  refreshToken: string;
  _id: string;
}
