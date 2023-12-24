import {
  AdsRequest,
  GetDetailResult,
  GetListResult,
  Location,
  Panel,
  Report,
} from '@/types/officer-management';
import { apiSlice } from './baseApiSlice';

export const officerManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<
      GetListResult<Location>,
      { page?: number; take?: number; wards?: string; districts?: string }
    >({
      query: (arg) => ({
        url: `/locations`,
        params: {
          page: arg.page,
          take: arg.take,
          wards: arg.wards,
          districts: arg.districts,
        },
      }),
    }),
    getLocationById: build.query<GetDetailResult<Location>, string>({
      query: (id) => `/locations/${id}`,
    }),
    getPanels: build.query<
      GetListResult<Panel>,
      {
        page?: number;
        take?: number;
        wards?: string;
        districts?: string;
        typeId?: number;
      }
    >({
      query: (arg) => ({
        url: `/panels`,
        params: {
          page: arg.page,
          take: arg.take,
          wards: arg.wards,
          districts: arg.districts,
          typeId: arg.typeId,
        },
      }),
    }),
    getPanelById: build.query<GetDetailResult<Panel>, string>({
      query: (id) => `/panels/${id}`,
    }),
    getReports: build.query<
      GetListResult<Report>,
      {
        page?: number;
        take?: number;
        wards?: string;
        districts?: string;
        targetType: string;
        typeId?: number;
      }
    >({
      query: (arg) => ({
        url: `/reports`,
        params: {
          page: arg.page,
          take: arg.take,
          wards: arg.wards,
          districts: arg.districts,
          targetType: arg.targetType,
          typeId: arg.typeId,
        },
      }),
    }),
    getReportById: build.query<GetDetailResult<Report>, string>({
      query: (id) => `/reports/${id}`,
    }),
    getRequests: build.query<
      GetListResult<AdsRequest>,
      {
        page?: number;
        take?: number;
        wards?: string;
        districts?: string;
        type?: string;
        status?: string;
      }
    >({
      query: (arg) => ({
        url: `/ads-requests`,
        params: {
          page: arg.page,
          take: arg.take,
          wards: arg.wards,
          districts: arg.districts,
          type: arg.type,
          status: arg.status,
        },
      }),
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useGetPanelsQuery,
  useGetPanelByIdQuery,
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGetRequestsQuery,
} = officerManagementApiSlice;
