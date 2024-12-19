import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import type { ApiResponse, BizCategory } from '@models';

export const ContactApi = createApi({
  reducerPath: 'ContactApi',
  baseQuery: baseQuery(),
  endpoints: build => ({
    send: build.mutation<ApiResponse<any>, any>({
      query: data => ({
        url: '/contact-us',
        method: 'POST',
        data,
      }),
    }),
  }),
});
