export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  role: 'Administrador' | 'Cliente';
  clientId: number | null;
  displayName: string;
  email: string;
  username: string;
}
