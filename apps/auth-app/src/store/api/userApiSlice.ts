import {
  CredentialPayload,
  LoginResponse,
  UserProfile,
} from '../../types/user';
import { setToken } from '../slice/userSlice';
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

export const { useLoginMutation, useGetProfileQuery } = userApiSlice;
