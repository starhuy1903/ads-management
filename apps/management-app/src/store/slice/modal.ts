import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  displayModal: string | null;
  onModalClose: ((...args: any[]) => void) | null;
}

type ModalPayload = {
  displayModal: string | null;
  [key: string]: any;
};

type ModalOptions = {
  onModalClose: ((...args: any[]) => void) | null;
  [key: string]: any;
};

const initialState: InitialState = {
  displayModal: null,
  onModalClose: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: {
      prepare: (displayModal: string | null, options?: ModalOptions) => ({
        payload: { displayModal, ...options },
      }),
      reducer: (_, action: PayloadAction<ModalPayload>) => ({
        ...initialState,
        ...action.payload,
      }),
    },
    hideModal: (state, action: PayloadAction<any>) => {
      if (action.payload === state.displayModal) {
        state.displayModal = null;
      }
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
