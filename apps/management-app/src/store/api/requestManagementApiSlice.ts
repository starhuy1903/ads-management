import {
  AdsRequest,
  GetDataResult,
  GetListResult,
  MessageResponse,
} from '@/types/cdoManagement';
import { apiSlice } from './baseApiSlice';
import { getOnMutationFunction } from './helper';

export const requestManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getModificationRequests: build.query<
      GetListResult<AdsRequest>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/ads-requests`,
        params: {
          page: arg.page || undefined,
          take: arg.limit || undefined,
          type: 'UPDATE_DATA',
        },
      }),
    }),
    getModificationRequestById: build.query<GetDataResult<AdsRequest>, number>({
      query: (arg) => ({ url: `/ads-requests/${arg}` }),
    }),
    getPermissionRequests: build.query<
      GetListResult<AdsRequest>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/ads-requests`,
        params: {
          page: arg.page || undefined,
          take: arg.limit || undefined,
          type: 'APPROVED_PANEL',
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
  useGetModificationRequestByIdQuery,
  useGetPermissionRequestsQuery,
  useGetPermissionRequestByIdQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
} = requestManagementApiSlice;
