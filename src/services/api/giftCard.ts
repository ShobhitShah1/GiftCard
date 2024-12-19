import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import type { ApiResponse, Merchant } from '@models';

export const GiftCardApi = createApi({
  reducerPath: 'GiftCardApi',
  baseQuery: baseQuery(),
  tagTypes: ['giftCard'],
  endpoints: build => ({
    get: build.query<ApiResponse<Merchant[]>, any>({
      query: q => {
        return {
          url: '/common/listing',
          method: 'GET',
          params: q,
        };
      },
    }),
    // eslint-disable-next-line prettier/prettier
    detail: build.query<ApiResponse<Merchant>&{fee:number}, { merchantId: Merchant['id'] }>({
      query: q => ({
        url: '/common/detail',
        method: 'GET',
        params: q,
      }),
    }),
  }),
});
