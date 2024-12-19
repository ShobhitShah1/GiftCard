import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import type { User, ApiResponse, AuthState, iNotification } from '@models';

export const AccountApi = createApi({
  reducerPath: 'AccountApi',
  baseQuery: baseQuery(),
  tagTypes: ['notification'],
  endpoints: build => ({
    me: build.query<ApiResponse<User>, void>({
      query: () => ({
        url: '/account/me',
        method: 'GET',
      }),
    }),
    changePassword: build.mutation<ApiResponse<any>, any>({
      query: q => ({
        url: '/account/changePassword',
        method: 'POST',
        data: q,
      }),
    }),
   
    update: build.mutation<ApiResponse<User>, any>({
      query: q => ({
        url: '/account/update',
        method: 'POST',
        data: q,
      }),
    }),
    notification: build.query<ApiResponse<iNotification[]>, void>({
      query: () => ({
        url: '/account/notification',
        method: 'GET',
      }),
      providesTags: ['notification'],
    }),
    unreadNotification: build.query<ApiResponse<{ count: number }>, void>({
      query: () => ({
        url: '/account/notification/unread',
        method: 'GET',
      }),
      providesTags: ['notification'],
    }),
    deleteNotif: build.mutation<ApiResponse<any>, { id: number }>({
      query: q => ({
        url: '/account/notification/delete',
        method: 'POST',
        data: q,
      }),
      invalidatesTags: ['notification'],
    }),
    signout: build.mutation<ApiResponse<any>, { token: string }>({
      query: q => ({
        url: '/auth/signout',
        method: 'POST',
        data: q,
      }),
    }),
    resendCode: build.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/auth/resend-code',
        method: 'GET',
      }),
    }),
  }),
});
