import {
  GetDetailResult,
  GetListResult,
  Location,
} from '@/types/officer-management';
import { apiSlice } from './baseApiSlice';

export const officerManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<
      GetListResult<Location>,
      { page?: number; take?: number; wardId?: number; districtId?: number }
    >({
      query: (arg) => ({
        url: `/locations`,
        params: {
          page: arg.page,
          take: arg.take,
          wardId: arg.wardId,
          districtId: arg.districtId,
        },
      }),
    }),
    getLocationById: build.query<GetDetailResult<Location>, string>({
      query: (id) => `/locations/${id}`,
    }),
  }),
});

export const { useGetLocationsQuery, useGetLocationByIdQuery } =
  officerManagementApiSlice;
