import {
  AdsType,
  AdsTypeDto,
  District,
  DistrictDto,
  GetDataResult,
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
import { getOnMutationFunction } from './helper';

export const generalManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getDistricts: build.query<
      GetListResult<'districts', District>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/districts`,
        params: {
          page: arg.page,
          take: arg.limit,
        },
      }),
    }),
    getDistrictById: build.query<GetDataResult<District>, number>({
      query: (id) => `/districts/${id}`,
    }),
    createDistrict: build.mutation<MessageResponse, DistrictDto>({
      query: (arg) => ({ url: '/districts', method: 'POST', body: arg }),
      onQueryStarted: getOnMutationFunction('District created'),
    }),
    updateDistrict: build.mutation<
      MessageResponse,
      { id: number; data: DistrictDto }
    >({
      query: (arg) => ({
        url: `/districts/${arg.id}`,
        method: 'PATCH',
        body: arg.data,
      }),
      onQueryStarted: getOnMutationFunction('District updated'),
    }),
    deleteDistricts: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/districts/${arg}`,
        method: 'DELETE',
      }),
      onQueryStarted: getOnMutationFunction('District deleted'),
    }),
    getWards: build.query<
      GetListResult<'wards', Ward>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/wards`,
        params: {
          page: arg.page,
          take: arg.limit,
        },
      }),
    }),
    getWardById: build.query<GetDataResult<Ward>, number>({
      query: (id) => `/wards/${id}`,
    }),
    createWard: build.mutation<MessageResponse, WardDto>({
      query: (arg) => ({ url: '/wards', method: 'POST', body: arg }),
      onQueryStarted: getOnMutationFunction('Ward created'),
    }),
    updateWard: build.mutation<MessageResponse, { id: number; data: WardDto }>({
      query: (arg) => ({
        url: `/wards/${arg.id}`,
        method: 'PATCH',
        body: arg.data,
      }),
      onQueryStarted: getOnMutationFunction('Ward updated'),
    }),
    deleteWards: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/wards/${arg}`,
        method: 'DELETE',
      }),
      onQueryStarted: getOnMutationFunction('Ward deleted'),
    }),
    getPanelTypes: build.query<
      GetListResult<'panelTypes', PanelType>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/panel-types`,
        params: {
          page: arg.page,
          take: arg.limit,
        },
      }),
    }),
    getPanelTypeById: build.query<GetDataResult<PanelType>, number>({
      query: (id) => `/panel-types/${id}`,
    }),
    createPanelType: build.mutation<MessageResponse, PanelTypeDto>({
      query: (arg) => ({ url: '/panel-types', method: 'POST', body: arg }),
      onQueryStarted: getOnMutationFunction('Panel type created'),
    }),
    updatePanelType: build.mutation<
      MessageResponse,
      { id: number; data: PanelTypeDto }
    >({
      query: (arg) => ({
        url: `/panel-types/${arg.id}`,
        method: 'PATCH',
        body: arg.data,
      }),
      onQueryStarted: getOnMutationFunction('Panel type updated'),
    }),
    deletePanelTypes: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/panel-types/${arg}`,
        method: 'DELETE',
      }),
      onQueryStarted: getOnMutationFunction('Panel type deleted'),
    }),
    getReportTypes: build.query<
      GetListResult<'reportTypes', ReportType>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/report-types`,
        params: {
          page: arg.page,
          take: arg.limit,
        },
      }),
    }),
    getReportTypeById: build.query<GetDataResult<ReportType>, number>({
      query: (id) => `/report-types/${id}`,
    }),
    createReportType: build.mutation<MessageResponse, ReportTypeDto>({
      query: (arg) => ({ url: '/report-types', method: 'POST', body: arg }),
      onQueryStarted: getOnMutationFunction('Report type created'),
    }),
    updateReportType: build.mutation<
      MessageResponse,
      { id: number; data: ReportTypeDto }
    >({
      query: (arg) => ({
        url: `/report-types/${arg.id}`,
        method: 'PATCH',
        body: arg.data,
      }),
      onQueryStarted: getOnMutationFunction('Report type updated'),
    }),
    deleteReportTypes: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/report-types/${arg}`,
        method: 'DELETE',
      }),
      onQueryStarted: getOnMutationFunction('Report type deleted'),
    }),
    getLocationTypes: build.query<
      GetListResult<'locationTypes',LocationType>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/location-types`,
        params: {
          page: arg.page,
          take: arg.limit,
        },
      }),
    }),
    getLocationTypeById: build.query<GetDataResult<LocationType>, number>({
      query: (id) => `/location-types/${id}`,
    }),
    createLocationType: build.mutation<MessageResponse, LocationTypeDto>({
      query: (arg) => ({ url: '/location-types', method: 'POST', body: arg }),
      onQueryStarted: getOnMutationFunction('Location type created'),
    }),
    updateLocationType: build.mutation<
      MessageResponse,
      { id: number; data: LocationTypeDto }
    >({
      query: (arg) => ({
        url: `/location-types/${arg.id}`,
        method: 'PATCH',
        body: arg.data,
      }),
      onQueryStarted: getOnMutationFunction('Location type updated'),
    }),
    deleteLocationTypes: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/location-types/${arg}`,
        method: 'DELETE',
      }),
      onQueryStarted: getOnMutationFunction('Location type deleted'),
    }),
    getAdsTypes: build.query<
      GetListResult<AdsType>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/adsTypes`,
        params: {
          page: arg.page,
          take: arg.limit,
        },
      }),
    }),
    getAdsTypeById: build.query<AdsType, number>({
      query: (id) => `/adsTypes/${id}`,
    }),
    createAdsType: build.mutation<MessageResponse, AdsTypeDto>({
      query: (arg) => ({ url: '/adsTypes', method: 'POST', body: arg }),
      onQueryStarted: getOnMutationFunction('Advertisement type created'),
    }),
    updateAdsType: build.mutation<
      MessageResponse,
      { id: number; data: AdsTypeDto }
    >({
      query: (arg) => ({
        url: `/adsTypes/${arg.id}`,
        method: 'PATCH',
        body: arg.data,
      }),
      onQueryStarted: getOnMutationFunction('Advertisement type updated'),
    }),
    deleteAdsTypes: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/adsTypes/${arg}`,
        method: 'DELETE',
      }),
      onQueryStarted: getOnMutationFunction('Advertisement type deleted'),
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
