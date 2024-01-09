import {
  GetListResult,
  MessageResponse,
  Panel,
  PanelDto,
  PanelType,
} from '@/types/officer-management';
import { apiSlice } from '../baseApiSlice';
import { getOnMutationFunction } from '../helper';

export const officerPanelApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
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
    getPanelById: build.query<Panel, string>({
      query: (id) => `/panels/${id}`,
      transformResponse: (response: { data: Panel }) => response.data,
    }),
    getPanelTypesOfficer: build.query<PanelType[], void>({
      query: () => ({
        url: `/panel-types`,
      }),
      transformResponse: (response: { data: PanelType[] }) => response.data,
    }),
    createPanel: build.mutation<MessageResponse, PanelDto>({
      query: (body) => {
        const bodyFormData = new FormData();

        bodyFormData.append('typeId', body.typeId.toString());
        bodyFormData.append('width', body.width.toString());
        bodyFormData.append('height', body.height.toString());
        bodyFormData.append('locationId', body.locationId.toString());
        bodyFormData.append('companyEmail', body.companyEmail);
        bodyFormData.append('companyNumber', body.companyNumber);
        body.createContractDate = new Date(
          body.createContractDate,
        ).toISOString();
        body.expiredContractDate = new Date(
          body.expiredContractDate,
        ).toISOString();
        bodyFormData.append('createContractDate', body.createContractDate);
        bodyFormData.append('expiredContractDate', body.expiredContractDate);
        body.images.forEach((image) => bodyFormData.append('images', image));

        return {
          url: '/panels',
          method: 'POST',
          body: bodyFormData,
        };
      },
      onQueryStarted: getOnMutationFunction(
        'Created the panel licensing request',
      ),
    }),
  }),
});

export const {
  useGetPanelsQuery,
  useGetPanelByIdQuery,
  useGetPanelTypesOfficerQuery,
  useCreatePanelMutation,
} = officerPanelApiSlice;
