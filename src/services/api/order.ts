import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import type { ApiResponse, iOrder, Merchant } from '@models';

export const OrderApi = createApi({
  reducerPath: 'OrderApi',
  baseQuery: baseQuery(),
  tagTypes: ['order'],
  endpoints: build => ({
    order: build.mutation<ApiResponse<{ paymentUrl: string , paymentIntent :string ,ephemeralKey : string , customer : string , payment_id : string , uuid : string }>, any>({
      query: q => {
        return {
          url: '/order',
          method: 'POST',
          data: q,
        };
      },
    }),
    stripepaymentstatus : build.query<ApiResponse<any>, any>({
      query: q => ({
        url: '/stripe-payment-status',
        method: 'POST',
        params: q,
      }),
    }),
    history: build.query<ApiResponse<iOrder[]>, void>({
      query: () => ({
        url: '/order/history',
        method: 'GET',
      }),
      providesTags: ['order'],
    }),
    delete: build.mutation<ApiResponse<any>, { id: string }>({
      query: q => ({
        url: `/order/delete/${q.id}`,
        method: 'GET',
      }),
      invalidatesTags: ['order'],
    }),
    agentVerify: build.mutation<ApiResponse<{ id: string }>, any>({
      query: q => ({
        url: 'common/agent-verify',
        method: 'POST',
        data: q,
      }),
    }),
    offlineOrder: build.mutation<ApiResponse<any>, any>({
      query: q => {
        return {
          url: '/order/offline',
          method: 'POST',
          data: q,
        };
      },
    }),
    deliveryMenu: build.query<ApiResponse<any>, { merchantId: Merchant['id'] }>({
      query: q => ({
        url: '/common/deliverymenu',
        method: 'GET',
        params: q,
      }),
    }),
  }),
});
