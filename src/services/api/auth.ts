import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import type { User, ApiResponse, AuthState } from '@models';

type ResponType = ApiResponse<AuthState>;

type LoginRequest = {
  identifier: string;
  password: string;
};

export const auth = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery(),
  tagTypes: ['account'],
  endpoints: build => ({
    login: build.mutation<ResponType, Partial<LoginRequest>>({
      query: credentials => ({
        url: 'auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),
    register: build.mutation<ResponType, any>({
      query: q => ({
        url: '/auth/register',
        method: 'POST',
        data: q,
      }),
    }),
    verify: build.mutation<ApiResponse<User>, { code: string }>({
      query: q => ({
        url: '/auth/verify',
        method: 'POST',
        data: q,
      }),
    }),
    resetPassword: build.mutation<ApiResponse<any>, any>({
      query: q => ({
        url: '/auth/reset-password',
        method: 'POST',
        data: q,
      }),
    }),
    deleteAccount: build.mutation<ApiResponse<any>, any>({
      query: q => ({
        url: '/auth/delete_account',
        method: 'POST',
        data: q,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useVerifyMutation } =
  auth;
