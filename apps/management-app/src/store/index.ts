import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { apiSlice } from './api/baseApiSlice';
import { modalSlice } from './slice/modal';
import { userSlice } from './slice/userSlice';
import { sidebarSlice } from './slice/sidebar';

const combinedReducer = combineReducers({
  user: userSlice.reducer,
  modal: modalSlice.reducer,
  sidebar: sidebarSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const store = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
