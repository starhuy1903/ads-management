import {
  GetListResult,
  MessageResponse,
  Report,
  UpdateReportDto,
} from '@/types/officer-management';
import { apiSlice } from '../baseApiSlice';
import { getOnMutationFunction } from '../helper';

export const officerReportApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
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
    getReportById: build.query<Report, string>({
      query: (id) => `/reports/${id}`,
      transformResponse: (response: { data: Report }) => response.data,
    }),
    updateReport: build.mutation<MessageResponse, UpdateReportDto>({
      query: (arg) => ({
        url: `/reports/${arg.id}`,
        method: 'PATCH',
        body: {
          status: arg.status,
          resolvedContent: arg?.resolvedContent,
        },
      }),
      onQueryStarted: getOnMutationFunction('Respond the report successfully'),
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useUpdateReportMutation,
} = officerReportApiSlice;
