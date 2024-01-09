import { AdsRequestStatus } from '@/constants/ads-request';
import {
  AdsRequest,
  GetListResult,
  MessageResponse,
  SendPanelRequestDto,
  UpdateLocationDto,
  UpdatePanelDto,
} from '@/types/officer-management';
import { apiSlice } from '../baseApiSlice';

export const officerManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
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
    getRequestById: build.query<AdsRequest, string>({
      query: (id) => `/ads-requests/${id}`,
      transformResponse: (response: { data: AdsRequest }) => response.data,
    }),
    createPanelRequest: build.mutation<MessageResponse, SendPanelRequestDto>({
      query: (arg) => ({
        url: '/ads-requests',
        method: 'POST',
        body: arg,
      }),
    }),
    createUpdateLocationRequest: build.mutation<
      MessageResponse,
      UpdateLocationDto
    >({
      query: (body) => {
        const bodyFormData = new FormData();

        bodyFormData.append(
          'belongLocationId',
          body.belongLocationId.toString(),
        );
        bodyFormData.append('userId', body.userId.toString());
        bodyFormData.append('typeId', body.typeId.toString());
        bodyFormData.append('adsTypeId', body.adsTypeId.toString());
        bodyFormData.append('name', body.name);
        body.images.forEach((image) => bodyFormData.append('images', image));
        bodyFormData.append('reason', body.reason);
        bodyFormData.append('lat', body.lat.toString());
        bodyFormData.append('long', body.long.toString());
        bodyFormData.append('isPlanning', body.isPlanning.toString());
        bodyFormData.append('fullAddress', body.fullAddress);
        bodyFormData.append('wardId', body.wardId.toString());
        bodyFormData.append('districtId', body.districtId.toString());

        return {
          url: '/ads-requests/update-location',
          method: 'POST',
          body: bodyFormData,
        };
      },
    }),
    createUpdatePanelRequest: build.mutation<MessageResponse, UpdatePanelDto>({
      query: (body) => {
        const bodyFormData = new FormData();

        bodyFormData.append('belongPanelId', body.belongPanelId.toString());
        bodyFormData.append('locationId', body.locationId.toString());
        bodyFormData.append('userId', body.userId.toString());
        bodyFormData.append('typeId', body.typeId.toString());
        body.images.forEach((image) => bodyFormData.append('images', image));
        bodyFormData.append('reason', body.reason);
        bodyFormData.append('width', body.width.toString());
        bodyFormData.append('height', body.height.toString());
        body.createContractDate = new Date(
          body.createContractDate,
        ).toISOString();
        body.expiredContractDate = new Date(
          body.expiredContractDate,
        ).toISOString();
        bodyFormData.append('createContractDate', body.createContractDate);
        bodyFormData.append('expiredContractDate', body.expiredContractDate);
        bodyFormData.append('companyEmail', body.companyEmail);
        bodyFormData.append('companyNumber', body.companyNumber);

        return {
          url: '/ads-requests/update-panel',
          method: 'POST',
          body: bodyFormData,
        };
      },
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
  useGetRequestsQuery,
  useLazyGetRequestsQuery,
  useGetRequestByIdQuery,
  useLazyGetRequestByIdQuery,
  useCreatePanelRequestMutation,
  useCreateUpdateLocationRequestMutation,
  useCreateUpdatePanelRequestMutation,
  useDeleteRequestMutation,
} = officerManagementApiSlice;
