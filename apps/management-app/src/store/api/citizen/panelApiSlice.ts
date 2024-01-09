import { GetList } from '@/types/common';
import { Panel } from '@/types/panel';
import { apiWithToastSlice } from '../baseApiSlice';

const panelApiToastSlice = apiWithToastSlice.injectEndpoints({
  endpoints: (build) => ({
    getPanelDetail: build.query<Panel, number>({
      query: (panelId) => ({
        url: `panels/${panelId}`,
      }),
    }),
    getAllPanels: build.query<GetList<Panel>, void>({
      query: () => ({
        url: 'panels/map',
      }),
    }),
  }),
});

export const { useGetPanelDetailQuery, useLazyGetAllPanelsQuery } =
  panelApiToastSlice;
