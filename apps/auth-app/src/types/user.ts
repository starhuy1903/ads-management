export type CredentialPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = CredentialPayload & {
  name: string;
};

export type VerifyPayload = {
  verifyToken: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenId: string;
  accessTokenExpires: string;
  user: UserProfile;
};

export type LoginError = {
  msg: string;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string;
};

export type MessageResponse = {
  message: string;
};
