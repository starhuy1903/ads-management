import { Panel } from '@/types/panel';
import { apiWithToastSlice } from '../baseApiSlice';

const panelApiToastSlice = apiWithToastSlice.injectEndpoints({
  endpoints: (build) => ({
    getPanelDetail: build.query<Panel, number>({
      query: (panelId) => ({
        url: `panels/${panelId}`,
      }),
    }),
  }),
});

export const { useGetPanelDetailQuery } = panelApiToastSlice;
