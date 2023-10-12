import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type StatusSliceType = {
  error?: { message: string };
  success?: { message: string };
};

const initialState: StatusSliceType = {
  error: undefined,
  success: undefined,
};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setSuccessMessage: (state, action: PayloadAction<string>) => {
      state.success = { message: action.payload };
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.error = { message: action.payload };
    },
  },
});

export const { setSuccessMessage, setErrorMessage } = statusSlice.actions;
