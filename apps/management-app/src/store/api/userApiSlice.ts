import auth from '@/utils/auth';
import {
  CredentialPayload,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutPayload,
  MessageResponse,
  ResetPasswordPayload,
  UserProfile,
  VerifyPayload,
} from '../../types/user';
import { logOut, setIsLoggedIn, setProfile } from '../slice/userSlice';
import { apiSlice } from './baseApiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, CredentialPayload>({
      query: (body) => ({
        url: 'auth/signin',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProfile(data.user));
          dispatch(setIsLoggedIn(true));
          auth.setToken(data.accessToken, data.refreshToken);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logout: build.mutation<MessageResponse, LogoutPayload>({
      query: (body) => ({
        url: 'auth/logout',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(logOut());
        } catch (error) {
          console.log(error);
        }
      },
    }),
    verify: build.mutation<MessageResponse, VerifyPayload>({
      query: (body) => ({
        url: 'auth/verify',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: build.mutation<
      ForgotPasswordResponse,
      ForgotPasswordPayload
    >({
      query: (body) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: build.mutation<MessageResponse, ResetPasswordPayload>({
      query: (body) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    getProfile: build.query<UserProfile, void>({
      query: () => 'users/me',
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProfile(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyGetProfileQuery,
  useLogoutMutation,
  useVerifyMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApiSlice;
