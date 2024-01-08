import { GetList } from '@/types/common';
import { AdLocation } from '@/types/location';
import { Panel } from '@/types/panel';
import { apiWithToastSlice } from '../baseApiSlice';

const locationApiToastSlice = apiWithToastSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocation: build.query<GetList<AdLocation>, void>({
      query: () => ({
        url: 'locations/map',
      }),
    }),
    getPanelByLocation: build.query<Panel[], number>({
      query: (locationId) => ({
        url: `locations/${locationId}/panels`,
      }),
      transformResponse: (response: { data: Panel[] }) => response.data,
    }),
  }),
});

export const { useGetLocationQuery, useGetPanelByLocationQuery } =
  locationApiToastSlice;
