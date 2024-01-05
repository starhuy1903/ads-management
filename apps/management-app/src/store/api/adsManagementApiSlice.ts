import {
  GetDataResult,
  GetListResult,
  LocationFull,
  PanelFull,
} from '@/types/cdoManagement';
import { apiSlice } from './baseApiSlice';

export const adsManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<
      GetListResult<LocationFull>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/locations`,
        params: {
          page: arg.page || undefined,
          take: arg.limit || undefined,
        },
      }),
    }),
    getLocationById: build.query<GetDataResult<LocationFull>, number>({
      query: (arg) => ({ url: `/locations/${arg}` }),
    }),
    getPanels: build.query<
      GetListResult<PanelFull>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/panels`,
        params: {
          page: arg.page || undefined,
          take: arg.limit || undefined,
        },
      }),
    }),
    getPanelById: build.query<GetDataResult<PanelFull>, number>({
      query: (arg) => ({ url: `/panels/${arg}` }),
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useLazyGetLocationByIdQuery,
  useGetPanelsQuery,
  useGetPanelByIdQuery,
  useLazyGetPanelByIdQuery,
} = adsManagementApiSlice;
