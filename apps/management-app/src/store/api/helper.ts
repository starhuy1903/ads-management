import toast from 'react-hot-toast';
import { RefreshResponse } from '@/types/user';
import { showError } from '@/utils/toast';
import { setLoading } from '../slice/statusSlice';

export interface ApiErrorResponse {
  status: number;
  data: { message: string; errors: { [k: string]: string[] } };
}

export function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error != null &&
    'status' in error &&
    typeof (error as any).status === 'number'
  );
}

export const isRefreshResponse = (data: unknown): data is RefreshResponse => {
  return (
    typeof data === 'object' &&
    data != null &&
    'accessToken' in data &&
    'refreshToken' in data
  );
};

export const toastApiError = (data: unknown) => {
  const isErrorObject =
    typeof data === 'object' &&
    data != null &&
    'message' in data &&
    typeof (data as any).message === 'string';
  const message = isErrorObject
    ? (data.message as string)
    : 'Something went wrong';
  showError(message);
};

export const getOnMutationFunction = (success: string) => {
  return async (_: any, api: any) => {
    toast.promise(api.queryFulfilled, {
      loading: 'Processing...',
      success: success,
      error: (error) => {
        return isApiErrorResponse(error.error)
          ? error.error.data?.message
          : 'Something went wrong';
      },
    });
    api.dispatch(setLoading(true));
    try {
      await api.queryFulfilled;
    } catch (error) {
      /* empty */
    } finally {
      api.dispatch(setLoading(false));
    }
  };
};
