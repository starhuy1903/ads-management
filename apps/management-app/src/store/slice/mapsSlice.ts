import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  isShowingAdPanel: false,
};

export const mapsSlice = createSlice({
  name: 'maps',
  initialState,
  reducers: {
    setIsShowingAdPanel: (state, action: PayloadAction<boolean>) => {
      state.isShowingAdPanel = action.payload;
    },
  },
});

export const { setIsShowingAdPanel } = mapsSlice.actions;
