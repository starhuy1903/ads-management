import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  displaySidebar: string | null;
  onSidebarClose: ((...args: any[]) => void) | null;
  // onSidebarReopen: ((...args: any[]) => void) | null;
}

type SidebarPayload = {
  displaySidebar: string | null;
  [key: string]: any;
};

type SidebarOptions = {
  onSidebarClose?: ((...args: any[]) => void) | null;
  // onSidebarReopen?: ((...args: any[]) => void) | null;
  [key: string]: any;
};

const initialState: SidebarState = {
  displaySidebar: null,
  onSidebarClose: null,
  // onSidebarReopen: null,
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    showSidebar: {
      prepare: (displaySidebar: string | null, options?: SidebarOptions) => ({
        payload: { displaySidebar, ...options },
      }),
      reducer: (_, action: PayloadAction<SidebarPayload>) => ({
        ...initialState,
        ...action.payload,
      }),
    },
    hideSidebar: (state) => {
      state.displaySidebar = null;
    },
    // resetSidebar: (state) => {
    //   state = initialState;
    // },
  },
});

export const { showSidebar, hideSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
