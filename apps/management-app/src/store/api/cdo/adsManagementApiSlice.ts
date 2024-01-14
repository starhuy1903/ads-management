import {
  GetDataResult,
  GetListResult,
  LocationListQueryOptions,
  PanelListQueryOptions,
  LocationDto,
  LocationFull,
  MessageResponse,
  PanelDto,
  PanelFull,
} from '@/types/cdoManagement';
import { apiSlice } from '../baseApiSlice';
import { getOnMutationFunction } from '../helper';

export const adsManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<
      GetListResult<LocationFull>,
      LocationListQueryOptions
    >({
      query: (arg) => ({
        url: `/locations`,
        params: {
          page: arg.page,
          take: arg.limit,
          status: arg.status,
          locationTypeId: arg.locationTypeId,
          adTypeId: arg.adTypeId,
          districts:
            arg.districts && arg.districts.length > 0
              ? arg.districts
              : undefined,
          wards: arg.wards && arg.wards.length > 0 ? arg.wards : undefined,
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
        arg.images?.forEach((image) => bodyFormData.append('images', image));

        return {
          url: '/locations',
          method: 'POST',
          body: bodyFormData,
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
        arg.data.images?.forEach((image) =>
          bodyFormData.append('images', image),
        );

        return {
          url: `/locations/${arg.id}`,
          method: 'PATCH',
          body: bodyFormData,
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
    getPanels: build.query<GetListResult<PanelFull>, PanelListQueryOptions>({
      query: (arg) => ({
        url: `/panels`,
        params: {
          page: arg.page,
          take: arg.limit,
          status: arg.status,
          typeId: arg.typeId,
          districts:
            arg.districts && arg.districts.length > 0
              ? arg.districts
              : undefined,
          wards: arg.wards && arg.wards.length > 0 ? arg.wards : undefined,
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
        arg.images?.forEach((image) => bodyFormData.append('images', image));

        return {
          url: '/panels',
          method: 'POST',
          body: bodyFormData,
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
        arg.data.images?.forEach((image) =>
          bodyFormData.append('images', image),
        );

        return {
          url: `/panels/${arg.id}`,
          method: 'PATCH',
          body: bodyFormData,
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
