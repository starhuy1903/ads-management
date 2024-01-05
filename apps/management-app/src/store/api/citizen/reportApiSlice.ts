import { GetList } from '@/types/common';
import { CreatedReport, ReportPayload, ReportType } from '@/types/report';
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
          bodyFormData.append(key, value as string | Blob);
        });

        return {
          url: 'reports',
          method: 'POST',
          body: bodyFormData,
          headers: {
            'Content-Type': 'multipart/form-data;',
            'Recaptcha-Token': body.captcha,
          },
        };
      },
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
