import { CreatedReport, ReportPayload } from '@/types/report';
import { apiSlice } from './baseApiSlice';

export const reportApiSlice = apiSlice.injectEndpoints({
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
            'recaptcha-token': body.captcha,
          },
        };
      },
    }),
    getReports: build.query<any, any>({
      query: () => ({
        url: 'reports',
      }),
    }),
  }),
});

export const { useCreateReportMutation, useGetReportsQuery } = reportApiSlice;
