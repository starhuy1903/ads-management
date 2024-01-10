import { Ward } from '@/types/officer-management';
import { apiSlice } from '../baseApiSlice';

export const officerWardApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getWardsByDistrictId: build.query<Ward[], string>({
      query: (districtId) => ({
        url: `/districts/${districtId}/wards`,
      }),
      transformResponse: (response: { data: Ward[] }) => response.data,
    }),
  }),
});

export const {
  useGetWardsByDistrictIdQuery,
  useLazyGetWardsByDistrictIdQuery,
} = officerWardApiSlice;
