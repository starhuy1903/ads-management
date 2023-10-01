export type CredentialPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = CredentialPayload & {
  name: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type LoginError = {
  msg: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};
