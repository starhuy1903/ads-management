import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  isShowingPlannedLocation: false,
  isShowingViolatedReport: false,
};

export const mapsSlice = createSlice({
  name: 'maps',
  initialState,
  reducers: {
    setIsShowingPlannedLocation: (state, action: PayloadAction<boolean>) => {
      state.isShowingPlannedLocation = action.payload;
    },
    setIsShowingViolatedReport: (state, action: PayloadAction<boolean>) => {
      state.isShowingViolatedReport = action.payload;
    },
  },
});

export const { setIsShowingPlannedLocation, setIsShowingViolatedReport } =
  mapsSlice.actions;
