import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { UserRole } from '@/constants/user';
import { UserSliceType } from '@/types/store/user';
import { RootState } from '..';
import { LoginResponse, UserProfile } from '../../types/user';

const initialState = {
  profile: {
    id: '',
    email: '',
    name: '',
    role: UserRole.CITIZEN,
  },
  token: {
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('accessToken') || '',
    tokenId: localStorage.getItem('tokenId') || '',
    accessTokenExpires: localStorage.getItem('accessTokenExpires') || '',
  },
  isLoggedIn: Boolean(localStorage.getItem('accessToken')),
} as UserSliceType;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },

    setToken: (state, action: PayloadAction<LoginResponse>) => {
      state.token = action.payload;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },

    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },

    logOut: (state) => {
      state.profile = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setIsLoggedIn, setToken, setProfile, logOut } =
  userSlice.actions;

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
