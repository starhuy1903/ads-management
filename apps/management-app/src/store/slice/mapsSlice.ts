import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AdLocation } from '@/types/location';
import { MapsSlice } from '@/types/store/maps';

const initialState: MapsSlice = {
  isShowingPlannedLocation: false,
  isShowingViolatedReport: false,
  selectedLocation: null,
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
    setSelectedLocation: (state, action: PayloadAction<AdLocation | null>) => {
      state.selectedLocation = action.payload;
    },
  },
});

export const {
  setIsShowingPlannedLocation,
  setIsShowingViolatedReport,
  setSelectedLocation,
} = mapsSlice.actions;
