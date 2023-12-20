import toast from 'react-hot-toast';
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

export const getOnMutationFunction = (success: string) => {
  return async (arg: any, api: any) => {
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
