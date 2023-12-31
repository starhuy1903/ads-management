import { GetList } from '@/types/common';
import { AdsLocation } from '@/types/location';
import { apiSlice } from '../baseApiSlice';

const locationApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocation: build.query<GetList<AdsLocation>, void>({
      query: () => ({
        url: 'locations',
      }),
    }),
  }),
});

export const { useGetLocationQuery } = locationApiSlice;
