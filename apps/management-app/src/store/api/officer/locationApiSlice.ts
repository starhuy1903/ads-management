import {
  AdsType,
  GetListResult,
  Location,
  LocationType,
} from '@/types/officer-management';
import { apiSlice } from '../baseApiSlice';

export const officerLocationApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<
      GetListResult<Location>,
      {
        page?: number;
        take?: number;
        wards?: string;
        districts?: string;
        status?: string;
      }
    >({
      query: (arg) => ({
        url: `/locations`,
        params: {
          page: arg.page,
          take: arg.take,
          wards: arg.wards,
          districts: arg.districts,
          status: arg.status,
        },
      }),
    }),
    getLocationById: build.query<Location, string>({
      query: (id) => `/locations/${id}`,
      transformResponse: (response: { data: Location }) => response.data,
    }),
    getLocationTypesOfficer: build.query<LocationType[], void>({
      query: () => ({
        url: `/location-types`,
      }),
      transformResponse: (response: { data: LocationType[] }) => response.data,
    }),
    getAdsTypesOfficer: build.query<AdsType[], void>({
      query: () => ({
        url: `/advertisement-types`,
      }),
      transformResponse: (response: { data: AdsType[] }) => response.data,
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useLazyGetLocationsQuery,
  useGetLocationByIdQuery,
  useLazyGetLocationByIdQuery,
  useGetLocationTypesOfficerQuery,
  useLazyGetLocationTypesOfficerQuery,
  useGetAdsTypesOfficerQuery,
  useLazyGetAdsTypesOfficerQuery,
} = officerLocationApiSlice;