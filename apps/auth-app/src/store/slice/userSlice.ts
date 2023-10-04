import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LoginResponse } from '../../types/user';

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
  isLoggedIn: false, // TODO: check local storage
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },

    setToken: (state, action: PayloadAction<LoginResponse>) => {
      state.token.accessToken = action.payload.accessToken;
      state.token.refreshToken = action.payload.refreshToken;
      state.token.tokenId = action.payload.tokenId;
      state.token.accessTokenExpires = action.payload.accessTokenExpires;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },

    setProfile: (state, action: PayloadAction<LoginResponse>) => {
      state.profile = action.payload.user;
    },

    logOut: (state) => {
      state.profile = initialState.profile;
      state.token = initialState.token;
      state.isLoggedIn = initialState.isLoggedIn;
      localStorage.setItem('accessToken', '');
      localStorage.setItem('refreshToken', '');
    },
  },
});

export const { setIsLoggedIn, setToken, setProfile, logOut } =
  userSlice.actions;
