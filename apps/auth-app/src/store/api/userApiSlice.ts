import {
  CredentialPayload,
  LoginResponse,
  MessageResponse,
  RegisterPayload,
  UserProfile,
  VerifyPayload,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  LogoutPayload,
} from '../../types/user';
import {
  setIsLoggedIn,
  setProfile,
  setToken,
  logOut,
} from '../slice/userSlice';
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
          dispatch(setProfile(data));
          dispatch(setToken(data));
          dispatch(setIsLoggedIn(true));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    register: build.mutation<LoginResponse, RegisterPayload>({
      query: (body) => ({
        url: 'auth/signup',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProfile(data));
          dispatch(setToken(data));
          dispatch(setIsLoggedIn(true));
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
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
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
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    resetPassword: build.mutation<MessageResponse, ResetPasswordPayload>({
      query: (body) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getProfile: build.query<UserProfile, void>({
      query: () => 'me', // TBD
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useRegisterMutation,
  useLogoutMutation,
  useVerifyMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApiSlice;
