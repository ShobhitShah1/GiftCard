import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import type { ApiResponse, BizCategory } from '@models';

export const BizCategoryApi = createApi({
  reducerPath: 'BizCategoryApi',
  baseQuery: baseQuery(),
  tagTypes: ['bizCategory'],
  endpoints: build => ({
    get: build.query<ApiResponse<BizCategory[]>, void>({
      query: () => ({
        url: '/common/biz-category',
        method: 'GET',
      }),
    }),
  }),
});
