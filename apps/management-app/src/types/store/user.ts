import { UserProfile } from '../user';

export type UserSliceType = {
  profile: UserProfile | null;
  token: {
    accessToken: string;
    refreshToken: string;
    tokenId: string;
    accessTokenExpires: string;
  } | null;
  isLoggedIn: boolean;
  // roles
  isCitizen: false;
  isWardOfficer: false;
  isDistrictOfficer: false;
  isDepartmentOfCultureOfficer: false;
};
