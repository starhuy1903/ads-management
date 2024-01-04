import {
  GetStatictisQueryOptions,
  GetStatictisResult,
} from '@/types/cdoManagement';
import { apiSlice } from './baseApiSlice';

export const statisticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getStatictis: build.query<GetStatictisResult, GetStatictisQueryOptions>({
      query: (arg) => ({
        url: '/reports/statistic',
        params: arg,
      }),
    }),
  }),
});

export const { useGetStatictisQuery, useLazyGetStatictisQuery } =
  statisticsApiSlice;
