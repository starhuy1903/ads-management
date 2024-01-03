import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { configs } from '@/configurations';
import auth from '@/utils/auth';
import { logOut } from '../slice/userSlice';
import { isRefreshResponse } from './helper';

const mutex = new Mutex();

const BASE_URL = configs.apiUrl;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = auth.getAccessToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  timeout: 30000,
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 403) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          {
            url: 'auth/refresh',
            method: 'POST',
            body: { refreshToken: auth.getRefreshToken() },
          },
          api,
          extraOptions,
        );

        if (isRefreshResponse(refreshResult.data)) {
          auth.setToken(
            refreshResult.data.accessToken,
            refreshResult.data.refreshToken,
          );
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
          // window.location.href = '/login';
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
});
