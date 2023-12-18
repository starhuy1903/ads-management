import {
  District,
  DistrictDto,
  GetListResult,
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
    deleteDistricts: build.mutation<MessageResponse, Array<number>>({
      query: (arg) => ({
        url: '/districts',
        method: 'DELETE',
        body: { ids: arg },
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
    deleteWards: build.mutation<MessageResponse, Array<number>>({
      query: (arg) => ({
        url: '/wards',
        method: 'DELETE',
        body: { ids: arg },
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
    deletePanelTypes: build.mutation<MessageResponse, Array<number>>({
      query: (arg) => ({
        url: '/panelTypes',
        method: 'DELETE',
        body: { ids: arg },
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
    deleteReportTypes: build.mutation<MessageResponse, Array<number>>({
      query: (arg) => ({
        url: '/reportTypes',
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
} = generalManagementApiSlice;
