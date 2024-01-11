import { UserRole } from '@/constants/user';
import { District, Ward } from './officer-management';

export type CredentialPayload = {
  email: string;
  password: string;
};

export type VerifyPayload = {
  verifyToken: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  newPassword: string;
  verifyToken: string;
};

export type LogoutPayload = {
  tokenId: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenId: string;
  user: UserProfile;
};

export type MessageResponse = {
  statusCode?: number;
  message?: string;
};

export type RegisterResponse = MessageResponse & {
  verificationLink?: string;
};

export type ForgotPasswordResponse = RegisterResponse;

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  dob: string;
  phoneNumber: string;
  ward?: Ward;
  district?: District;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};
