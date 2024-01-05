import { GetList } from '@/types/common';
import { AdLocation } from '@/types/location';
import { Panel } from '@/types/panel';
import { apiWithToastSlice } from '../baseApiSlice';

const locationApiToastSlice = apiWithToastSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocation: build.query<GetList<AdLocation>, void>({
      query: () => ({
        url: 'locations',
      }),
    }),
    getPanelByLocation: build.query<GetList<Panel>, number>({
      query: (locationId) => ({
        url: `locations/${locationId}/panels`,
      }),
    }),
  }),
});

export const {
  useGetLocationQuery,
  useLazyGetLocationQuery,
  useLazyGetPanelByLocationQuery,
} = locationApiToastSlice;
