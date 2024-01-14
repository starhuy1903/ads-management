import {
  AdsRequest,
  IAdsRequestViewOptions,
  GetDataResult,
  GetListResult,
  MessageResponse,
} from '@/types/cdoManagement';
import { apiSlice } from '../baseApiSlice';
import { getOnMutationFunction } from '../helper';

export const requestManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getModificationRequests: build.query<
      GetListResult<AdsRequest>,
      IAdsRequestViewOptions
    >({
      query: (arg) => ({
        url: `/ads-requests`,
        params: {
          take: arg.take,
          page: arg.page,
          type: 'UPDATE_DATA',
          status: arg.status,
          targetType: arg.targetType,
          districts: arg.districts.length > 0 ? arg.districts : undefined,
          wards: arg.wards.length > 0 ? arg.wards : undefined,
        },
      }),
    }),
    getModificationRequestById: build.query<GetDataResult<AdsRequest>, number>({
      query: (arg) => ({ url: `/ads-requests/${arg}` }),
    }),
    getPermissionRequests: build.query<
      GetListResult<AdsRequest>,
      IAdsRequestViewOptions
    >({
      query: (arg) => ({
        url: `/ads-requests`,
        params: {
          take: arg.take,
          page: arg.page,
          type: 'APPROVED_PANEL',
          status: arg.status,
          targetType: arg.targetType,
          districts: arg.districts.length > 0 ? arg.districts : undefined,
          wards: arg.wards.length > 0 ? arg.wards : undefined,
        },
      }),
    }),
    getPermissionRequestById: build.query<GetDataResult<AdsRequest>, number>({
      query: (arg) => ({ url: `/ads-requests/${arg}` }),
    }),
    approveRequest: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/ads-requests/${arg}/approve`,
        method: 'PATCH',
      }),
      onQueryStarted: getOnMutationFunction('Request approved'),
    }),
    rejectRequest: build.mutation<MessageResponse, number>({
      query: (arg) => ({ url: `/ads-requests/${arg}/reject`, method: 'PATCH' }),
      onQueryStarted: getOnMutationFunction('Request rejected'),
    }),
  }),
});

export const {
  useGetModificationRequestsQuery,
  useLazyGetModificationRequestsQuery,
  useGetModificationRequestByIdQuery,
  useGetPermissionRequestsQuery,
  useLazyGetPermissionRequestsQuery,
  useGetPermissionRequestByIdQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
} = requestManagementApiSlice;
