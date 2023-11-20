import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LoginResponse, UserProfile } from '../../types/user';

type UserSliceType = {
  profile: UserProfile | null;
  token: {
    accessToken: string;
    refreshToken: string;
    tokenId: string;
    accessTokenExpires: string;
  } | null;
  isLoggedIn: boolean;
};

const initialState = {
  profile: {
    id: '',
    email: '',
    name: '',
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

    setProfile: (state, action: PayloadAction<LoginResponse>) => {
      state.profile = action.payload.user;
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
