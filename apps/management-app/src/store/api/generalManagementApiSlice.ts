import {
  AdsType,
  AdsTypeDto,
  District,
  DistrictDto,
  GetListResult,
  LocationType,
  LocationTypeDto,
  MessageResponse,
  PanelType,
  PanelTypeDto,
  ReportType,
  ReportTypeDto,
  Ward,
  WardDto,
} from '@/types/cdoManagement';
import { apiSlice } from './baseApiSlice';

export const generalManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getDistricts: build.query<
      GetListResult<District>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/districts`,
        params: {
          page: arg.page || undefined,
          limit: arg.limit || undefined,
        },
      }),
    }),
    getDistrictById: build.query<District, number>({
      query: (id) => `/districts/${id}`,
    }),
    createDistrict: build.mutation<MessageResponse, DistrictDto>({
      query: (arg) => ({ url: '/districts', method: 'POST', body: arg }),
    }),
    updateDistrict: build.mutation<
      MessageResponse,
      { id: number; data: DistrictDto }
    >({
      query: (arg) => ({
        url: `/districts/${arg.id}`,
        method: 'PUT',
        body: arg.data,
      }),
    }),
    deleteDistricts: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/districts/${arg}`,
        method: 'DELETE',
      }),
    }),
    getWards: build.query<
      GetListResult<Ward>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/wards`,
        params: {
          page: arg.page || undefined,
          limit: arg.limit || undefined,
        },
      }),
    }),
    getWardById: build.query<Ward, number>({
      query: (id) => `/wards/${id}`,
    }),
    createWard: build.mutation<MessageResponse, WardDto>({
      query: (arg) => ({ url: '/wards', method: 'POST', body: arg }),
    }),
    updateWard: build.mutation<MessageResponse, { id: number; data: WardDto }>({
      query: (arg) => ({
        url: `/wards/${arg.id}`,
        method: 'PUT',
        body: arg.data,
      }),
    }),
    deleteWards: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/wards/${arg}`,
        method: 'DELETE',
      }),
    }),
    getPanelTypes: build.query<
      GetListResult<PanelType>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/panelTypes`,
        params: {
          page: arg.page || undefined,
          limit: arg.limit || undefined,
        },
      }),
    }),
    getPanelTypeById: build.query<PanelType, number>({
      query: (id) => `/panelTypes/${id}`,
    }),
    createPanelType: build.mutation<MessageResponse, PanelTypeDto>({
      query: (arg) => ({ url: '/panelTypes', method: 'POST', body: arg }),
    }),
    updatePanelType: build.mutation<
      MessageResponse,
      { id: number; data: PanelTypeDto }
    >({
      query: (arg) => ({
        url: `/panelTypes/${arg.id}`,
        method: 'PUT',
        body: arg.data,
      }),
    }),
    deletePanelTypes: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/panelTypes/${arg}`,
        method: 'DELETE',
      }),
    }),
    getReportTypes: build.query<
      GetListResult<ReportType>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/reportTypes`,
        params: {
          page: arg.page || undefined,
          limit: arg.limit || undefined,
        },
      }),
    }),
    getReportTypeById: build.query<ReportType, number>({
      query: (id) => `/reportTypes/${id}`,
    }),
    createReportType: build.mutation<MessageResponse, ReportTypeDto>({
      query: (arg) => ({ url: '/reportTypes', method: 'POST', body: arg }),
    }),
    updateReportType: build.mutation<
      MessageResponse,
      { id: number; data: ReportTypeDto }
    >({
      query: (arg) => ({
        url: `/reportTypes/${arg.id}`,
        method: 'PUT',
        body: arg.data,
      }),
    }),
    deleteReportTypes: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/reportTypes/${arg}`,
        method: 'DELETE',
      }),
    }),
    getLocationTypes: build.query<
      GetListResult<LocationType>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/locationTypes`,
        params: {
          page: arg.page || undefined,
          limit: arg.limit || undefined,
        },
      }),
    }),
    getLocationTypeById: build.query<LocationType, number>({
      query: (id) => `/locationTypes/${id}`,
    }),
    createLocationType: build.mutation<MessageResponse, LocationTypeDto>({
      query: (arg) => ({ url: '/locationTypes', method: 'POST', body: arg }),
    }),
    updateLocationType: build.mutation<
      MessageResponse,
      { id: number; data: LocationTypeDto }
    >({
      query: (arg) => ({
        url: `/locationTypes/${arg.id}`,
        method: 'PUT',
        body: arg.data,
      }),
    }),
    deleteLocationTypes: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/locationTypes/${arg}`,
        method: 'DELETE',
      }),
    }),
    getAdsTypes: build.query<
      GetListResult<AdsType>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/adsTypes`,
        params: {
          page: arg.page || undefined,
          limit: arg.limit || undefined,
        },
      }),
    }),
    getAdsTypeById: build.query<AdsType, number>({
      query: (id) => `/adsTypes/${id}`,
    }),
    createAdsType: build.mutation<MessageResponse, AdsTypeDto>({
      query: (arg) => ({ url: '/adsTypes', method: 'POST', body: arg }),
    }),
    updateAdsType: build.mutation<
      MessageResponse,
      { id: number; data: AdsTypeDto }
    >({
      query: (arg) => ({
        url: `/adsTypes/${arg.id}`,
        method: 'PUT',
        body: arg.data,
      }),
    }),
    deleteAdsTypes: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/adsTypes/${arg}`,
        method: 'DELETE',
        body: { ids: arg },
      }),
    }),
  }),
});

export const {
  useGetDistrictsQuery,
  useLazyGetDistrictsQuery,
  useGetDistrictByIdQuery,
  useLazyGetDistrictByIdQuery,
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
  useDeleteDistrictsMutation,
  useGetWardsQuery,
  useGetWardByIdQuery,
  useLazyGetWardByIdQuery,
  useCreateWardMutation,
  useUpdateWardMutation,
  useDeleteWardsMutation,
  useGetPanelTypesQuery,
  useGetPanelTypeByIdQuery,
  useLazyGetPanelTypeByIdQuery,
  useCreatePanelTypeMutation,
  useUpdatePanelTypeMutation,
  useDeletePanelTypesMutation,
  useGetReportTypesQuery,
  useGetReportTypeByIdQuery,
  useLazyGetReportTypeByIdQuery,
  useCreateReportTypeMutation,
  useUpdateReportTypeMutation,
  useDeleteReportTypesMutation,
  useGetLocationTypesQuery,
  useGetLocationTypeByIdQuery,
  useLazyGetLocationTypeByIdQuery,
  useCreateLocationTypeMutation,
  useUpdateLocationTypeMutation,
  useDeleteLocationTypesMutation,
  useGetAdsTypesQuery,
  useGetAdsTypeByIdQuery,
  useLazyGetAdsTypeByIdQuery,
  useCreateAdsTypeMutation,
  useUpdateAdsTypeMutation,
  useDeleteAdsTypesMutation,
} = generalManagementApiSlice;
