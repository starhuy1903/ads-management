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
    getSentReports: build.query<GetList<CreatedReport>, string>({
      query: (userUuid) => ({
        url: `reports/get-me?userUuid=${userUuid}`,
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
  useGetSentReportsQuery,
  useLazyGetSentReportsQuery,
  useGetReportTypesQuery,
} = reportApiToastSlice;
