import { GetListResult, LocationDto } from '@/types/officer.dto';
import { apiSlice } from './baseApiSlice';

export const officerManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<
      GetListResult<LocationDto>,
      { page?: number; take?: number; wardId?: number; districtId?: number }
    >({
      query: (arg) => ({
        url: `/locations`,
        params: {
          page: arg.page || undefined,
          take: arg.take || undefined,
          wardId: arg.wardId || undefined,
          districtId: arg.districtId || undefined,
        },
      }),
    }),
  }),
});

export const { useGetLocationsQuery } = officerManagementApiSlice;
