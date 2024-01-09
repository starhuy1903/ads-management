import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  isShowingAdPanel: false,
  isShowingViolatedReport: false,
};

export const mapsSlice = createSlice({
  name: 'maps',
  initialState,
  reducers: {
    setIsShowingAdPanel: (state, action: PayloadAction<boolean>) => {
      state.isShowingAdPanel = action.payload;
    },
    setIsShowingViolatedReport: (state, action: PayloadAction<boolean>) => {
      state.isShowingViolatedReport = action.payload;
    },
  },
});

export const { setIsShowingAdPanel, setIsShowingViolatedReport } =
  mapsSlice.actions;
