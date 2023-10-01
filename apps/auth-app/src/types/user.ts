export type CredentialPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};
