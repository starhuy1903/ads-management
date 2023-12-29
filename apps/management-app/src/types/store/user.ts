import { UserProfile } from '../user';

export type UserSliceType = {
  profile: UserProfile | null;
  isLoggedIn: boolean;
};
