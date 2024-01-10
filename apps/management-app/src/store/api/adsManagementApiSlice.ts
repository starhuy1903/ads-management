import {
  GetDataResult,
  GetListResult,
  LocationDto,
  LocationFull,
  MessageResponse,
  PanelDto,
  PanelFull,
} from '@/types/cdoManagement';
import { apiSlice } from './baseApiSlice';
import { getOnMutationFunction } from './helper';

export const adsManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<
      GetListResult<LocationFull>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/locations`,
        params: {
          page: arg.page,
          take: arg.limit,
        },
      }),
    }),
    getLocationById: build.query<GetDataResult<LocationFull>, number>({
      query: (arg) => ({ url: `/locations/${arg}` }),
    }),
    createLocation: build.mutation<MessageResponse, LocationDto>({
      query: (arg) => {
        const bodyFormData = new FormData();
        Object.entries(arg).forEach(([key, value]) => {
          bodyFormData.append(key, value as string | Blob);
        });

        return {
          url: '/locations',
          method: 'POST',
          body: bodyFormData,
          // headers: {
          //   'Content-Type': 'multipart/form-data;',
          // },
        };
      },
      onQueryStarted: getOnMutationFunction('Location created'),
    }),
    updateLocation: build.mutation<
      MessageResponse,
      { id: number; data: LocationDto }
    >({
      query: (arg) => {
        const bodyFormData = new FormData();
        Object.entries(arg.data).forEach(([key, value]) => {
          bodyFormData.append(key, value as string | Blob);
        });

        return {
          url: '/locations',
          method: 'PATCH',
          body: bodyFormData,
          // headers: {
          //   'Content-Type': 'multipart/form-data;',
          // },
        };
      },
      onQueryStarted: getOnMutationFunction('Location updated'),
    }),
    deleteLocations: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/locations/${arg}`,
        method: 'DELETE',
      }),
      onQueryStarted: getOnMutationFunction('Location deleted'),
    }),
    getPanels: build.query<
      GetListResult<PanelFull>,
      { page?: number; limit?: number }
    >({
      query: (arg) => ({
        url: `/panels`,
        params: {
          page: arg.page,
          take: arg.limit,
        },
      }),
    }),
    getPanelById: build.query<GetDataResult<PanelFull>, number>({
      query: (arg) => ({ url: `/panels/${arg}` }),
    }),
    createPanel: build.mutation<MessageResponse, PanelDto>({
      query: (arg) => {
        const bodyFormData = new FormData();
        Object.entries(arg).forEach(([key, value]) => {
          bodyFormData.append(key, value as string | Blob);
        });

        return {
          url: '/panels',
          method: 'POST',
          body: bodyFormData,
          // headers: {
          //   'Content-Type': 'multipart/form-data;',
          // },
        };
      },
      onQueryStarted: getOnMutationFunction('Panel created'),
    }),
    updatePanel: build.mutation<
      MessageResponse,
      { id: number; data: PanelDto }
    >({
      query: (arg) => {
        const bodyFormData = new FormData();
        Object.entries(arg.data).forEach(([key, value]) => {
          bodyFormData.append(key, value as string | Blob);
        });

        return {
          url: '/panels',
          method: 'PATCH',
          body: bodyFormData,
          // headers: {
          //   'Content-Type': 'multipart/form-data;',
          // },
        };
      },
      onQueryStarted: getOnMutationFunction('Panel updated'),
    }),
    deletePanels: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/panels/${arg}`,
        method: 'DELETE',
      }),
      onQueryStarted: getOnMutationFunction('Panel deleted'),
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useLazyGetLocationsQuery,
  useGetLocationByIdQuery,
  useLazyGetLocationByIdQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationsMutation,
  useGetPanelsQuery,
  useLazyGetPanelsQuery,
  useGetPanelByIdQuery,
  useLazyGetPanelByIdQuery,
  useCreatePanelMutation,
  useUpdatePanelMutation,
  useDeletePanelsMutation,
} = adsManagementApiSlice;
