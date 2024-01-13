import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { UserRole } from '@/constants/user';
import { UserSliceType } from '@/types/store/user';
import auth from '@/utils/auth';
import { RootState } from '..';
import { UserProfile } from '../../types/user';

const initialState: UserSliceType = {
  profile: null,
  isLoggedIn: Boolean(auth.getAccessToken()),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },

    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },

    logOut: (state) => {
      state.profile = null;
      state.isLoggedIn = false;
      auth.logout();
    },
  },
});

export const { setIsLoggedIn, setProfile, logOut } = userSlice.actions;

export const checkRole = createSelector(
  (state: RootState) => state.user.profile?.role || UserRole.CITIZEN,
  (role) => {
    return {
      isCitizen: role === UserRole.CITIZEN,
      isWardOfficer: role === UserRole.WARD_OFFICER,
      isDistrictOfficer: role === UserRole.DISTRICT_OFFICER,
      isCDO: role === UserRole.CDO,
    };
  },
);
