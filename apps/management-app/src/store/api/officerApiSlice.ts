import { AdsRequestStatus } from '@/constants/ads-request';
import {
  AdsRequest,
  GetDetailResult,
  GetListResult,
  Location,
  LocationType,
  MessageResponse,
  Panel,
  PanelType,
  Report,
} from '@/types/officer-management';
import { apiSlice } from './baseApiSlice';
import { getOnMutationFunction } from './helper';

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
    getLocationTypesOfficer: build.query<
      GetListResult<LocationType>,
      {
        page?: number;
        take?: number;
      }
    >({
      query: (arg) => ({
        url: `/location-types`,
        params: {
          page: arg.page,
          take: arg.take,
        },
      }),
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
    getPanelTypesOfficer: build.query<
      GetListResult<PanelType>,
      {
        page?: number;
        take?: number;
      }
    >({
      query: (arg) => ({
        url: `/panel-types`,
        params: {
          page: arg.page,
          take: arg.take,
        },
      }),
    }),
    createPanel: build.mutation<MessageResponse, FormData>({
      query: (arg) => ({ url: '/panels', method: 'POST', body: arg }),
      onQueryStarted: getOnMutationFunction(
        'Created the panel licensing request',
      ),
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
        targetType?: string;
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
          targetType: arg.targetType,
          status: arg.status,
        },
      }),
    }),
    getRequestById: build.query<GetDetailResult<AdsRequest>, string>({
      query: (id) => `/ads-requests/${id}`,
    }),
    createUpdateLocationRequest: build.mutation<MessageResponse, FormData>({
      query: (arg) => ({
        url: '/ads-requests/update-location',
        method: 'POST',
        body: arg,
      }),
      onQueryStarted: getOnMutationFunction('Create the request successfully'),
    }),
    createUpdatePanelRequest: build.mutation<MessageResponse, FormData>({
      query: (arg) => ({
        url: '/ads-requests/update-panel',
        method: 'POST',
        body: arg,
      }),
      onQueryStarted: getOnMutationFunction('Create the request successfully'),
    }),
    deleteRequest: build.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/ads-requests/${id}`,
        method: 'PATCH',
        body: {
          status: AdsRequestStatus.CANCELED,
        },
      }),
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useGetLocationTypesOfficerQuery,
  useGetPanelsQuery,
  useGetPanelByIdQuery,
  useGetPanelTypesOfficerQuery,
  useCreatePanelMutation,
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGetRequestsQuery,
  useGetRequestByIdQuery,
  useCreateUpdateLocationRequestMutation,
  useCreateUpdatePanelRequestMutation,
  useDeleteRequestMutation,
} = officerManagementApiSlice;
