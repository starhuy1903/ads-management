import { Panel } from '@/types/panel';
import { apiSlice } from '../baseApiSlice';

const panelApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPanelDetail: build.query<Panel, number>({
      query: (panelId) => ({
        url: `panels/${panelId}`,
      }),
    }),
  }),
});

export const { useGetPanelDetailQuery } = panelApiSlice;
