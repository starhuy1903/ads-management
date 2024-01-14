import {
  GetListResult,
  MessageResponse,
  Report,
  UpdateReportDto,
} from '@/types/officer-management';
import { apiSlice } from '../baseApiSlice';

export const officerReportApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getReportsOfficer: build.query<
      GetListResult<Report>,
      {
        page?: number;
        take?: number;
        wards?: number[];
        districts?: string;
        targetType: string;
        typeId?: number;
      }
    >({
      query: (arg) => {
        if (arg.wards && arg?.wards?.length > 0) {
          return {
            url: `/reports`,
            params: {
              page: arg.page,
              take: arg.take,
              wards: arg.wards.join(','),
              districts: arg.districts,
              targetType: arg.targetType,
              typeId: arg.typeId,
            },
          };
        }

        return {
          url: `/reports`,
          params: {
            page: arg.page,
            take: arg.take,
            districts: arg.districts,
            targetType: arg.targetType,
            typeId: arg.typeId,
          },
        };
      },
    }),
    getReportByIdOfficer: build.query<Report, string>({
      query: (id) => `/reports/${id}`,
      transformResponse: (response: { data: Report }) => response.data,
    }),
    updateReportOfficer: build.mutation<MessageResponse, UpdateReportDto>({
      query: (arg) => ({
        url: `/reports/${arg.id}`,
        method: 'PATCH',
        body: {
          status: arg.status,
          resolvedContent: arg?.resolvedContent,
        },
      }),
    }),
  }),
});

export const {
  useGetReportsOfficerQuery,
  useLazyGetReportsOfficerQuery,
  useGetReportByIdOfficerQuery,
  useLazyGetReportByIdOfficerQuery,
  useUpdateReportOfficerMutation,
} = officerReportApiSlice;
