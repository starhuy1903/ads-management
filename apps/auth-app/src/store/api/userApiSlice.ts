import {
  CredentialPayload,
  LoginResponse,
  RegisterPayload,
  UserProfile,
} from '../../types/user';
import { setIsLoggedIn, setToken } from '../slice/userSlice';
import { apiSlice } from './baseApiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, CredentialPayload>({
      query: (body) => ({
        url: 'login', // TBD
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data));
          dispatch(setIsLoggedIn(true));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    register: build.mutation<LoginResponse, RegisterPayload>({
      query: (body) => ({
        url: 'signup',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data));
          dispatch(setIsLoggedIn(true));
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

export const { useLoginMutation, useGetProfileQuery, useRegisterMutation } =
  userApiSlice;
