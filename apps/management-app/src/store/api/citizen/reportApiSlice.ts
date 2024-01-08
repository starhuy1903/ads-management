import { GetList } from '@/types/common';
import { CreatedReport, ReportPayload, ReportType } from '@/types/report';
import reportStorage from '@/utils/sent-report';
import { apiWithToastSlice } from '../baseApiSlice';

export const reportApiToastSlice = apiWithToastSlice.injectEndpoints({
  endpoints: (build) => ({
    createReport: build.mutation<CreatedReport, ReportPayload>({
      query: (body) => {
        const bodyFormData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
          if (key === 'captcha') {
            return;
          }
          bodyFormData.append(key, value);
        });

        return {
          url: 'reports',
          method: 'POST',
          body: bodyFormData,
          headers: {
            'Recaptcha-Token': body.captcha,
          },
        };
      },
      onQueryStarted: async (_, { queryFulfilled }) => {
        const { data } = await queryFulfilled;
        reportStorage.addReportId(data.userUuid);
      },
      transformResponse: (response: { data: CreatedReport }) => response.data,
    }),
    getReports: build.query<any, any>({
      query: () => ({
        url: 'reports',
      }),
    }),
    getReportTypes: build.query<GetList<ReportType>, void>({
      query: () => ({
        url: 'report-types',
      }),
    }),
  }),
});

export const {
  useCreateReportMutation,
  useGetReportsQuery,
  useGetReportTypesQuery,
} = reportApiToastSlice;
