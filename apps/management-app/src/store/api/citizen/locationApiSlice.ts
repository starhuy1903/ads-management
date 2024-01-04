import { GetList } from '@/types/common';
import { AdLocation } from '@/types/location';
import { Panel } from '@/types/panel';
import { apiSlice } from '../baseApiSlice';

const locationApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocation: build.query<GetList<AdLocation>, void>({
      query: () => ({
        url: 'locations',
      }),
    }),
    getPanelByLocation: build.query<GetList<Panel>, { locationId: number }>({
      query: (locationId) => ({
        url: `locations/${locationId}/panels`,
      }),
    }),
  }),
});

export const { useGetLocationQuery, useLazyGetPanelByLocationQuery } =
  locationApiSlice;
