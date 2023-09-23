import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LoginResponse } from '../../types/user';

const initialState = {
  profile: {
    name: '',
    email: '',
  },
  token: {
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('accessToken') || '',
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
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },

    logOut: (state) => {
      state.profile = initialState.profile;
      state.token = initialState.token;
      localStorage.setItem('accessToken', '');
      localStorage.setItem('refreshToken', '');
    },
  },
});

export const { setIsLoggedIn, setToken, logOut } = userSlice.actions;
