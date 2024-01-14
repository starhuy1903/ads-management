import {
  GetListResult,
  AccountListQueryOptions,
  AccountDto,
  Account,
  MessageResponse,
  UpdateAccountDto,
} from '@/types/cdoManagement';
import { apiSlice } from '../baseApiSlice';
import { getOnMutationFunction } from '../helper';

export const accountManagementApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAccounts: build.query<GetListResult<Account>, AccountListQueryOptions>({
      query: (arg) => ({
        url: `/users`,
        params: {
          page: arg.page,
          take: arg.limit,
          role: arg.role,
        },
      }),
    }),
    getAccountById: build.query<Account, number>({
      query: (arg) => ({ url: `/users/${arg}` }),
    }),
    createAccount: build.mutation<MessageResponse, AccountDto>({
      query: (arg) => {
        return {
          url: '/users',
          method: 'POST',
          body: arg,
        };
      },
      onQueryStarted: getOnMutationFunction('Account created'),
    }),
    updateAccount: build.mutation<
      MessageResponse,
      { id: number; data: UpdateAccountDto }
    >({
      query: (arg) => {
        return {
          url: `/users/${arg.id}`,
          method: 'PATCH',
          body: arg.data,
        };
      },
      onQueryStarted: getOnMutationFunction('Account updated'),
    }),
    deleteAccounts: build.mutation<MessageResponse, number>({
      query: (arg) => ({
        url: `/users/${arg}`,
        method: 'DELETE',
      }),
      onQueryStarted: getOnMutationFunction('Account deleted'),
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useLazyGetAccountsQuery,
  useGetAccountByIdQuery,
  useLazyGetAccountByIdQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountsMutation,
} = accountManagementApiSlice;
