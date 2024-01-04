import { Panel } from '@/types/panel';
import { apiSlice } from '../baseApiSlice';

const panelApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPanelDetail: build.query<Panel, { panelId: number }>({
      query: (panelId) => ({
        url: `panels/${panelId}`,
      }),
    }),
  }),
});

export const { useLazyGetPanelDetailQuery } = panelApiSlice;
