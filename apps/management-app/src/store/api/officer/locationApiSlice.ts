import { GetList } from '@/types/common';
import { AdLocation } from '@/types/location';
import { AdsType, Location, LocationType } from '@/types/officer-management';
import { apiSlice } from '../baseApiSlice';

export const officerLocationApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocationsOfficer: build.query<
      GetList<AdLocation>,
      {
        page?: number;
        take?: number;
        wards?: number[];
        districts?: string;
        status?: string;
      }
    >({
      query: (arg) => {
        if (arg.wards && arg?.wards?.length > 0) {
          return {
            url: `/locations`,
            params: {
              page: arg.page,
              take: arg.take,
              wards: arg.wards.join(','),
              districts: arg.districts,
              status: arg.status,
            },
          };
        }

        return {
          url: `/locations`,
          params: {
            page: arg.page,
            take: arg.take,
            districts: arg.districts,
            status: arg.status,
          },
        };
      },
    }),
    getLocationByIdOfficer: build.query<Location, string>({
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
  useGetLocationsOfficerQuery,
  useLazyGetLocationsOfficerQuery,
  useGetLocationByIdOfficerQuery,
  useLazyGetLocationByIdOfficerQuery,
  useGetLocationTypesOfficerQuery,
  useLazyGetLocationTypesOfficerQuery,
  useGetAdsTypesOfficerQuery,
  useLazyGetAdsTypesOfficerQuery,
} = officerLocationApiSlice;
