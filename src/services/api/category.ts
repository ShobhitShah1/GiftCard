import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import type { ApiResponse, Category } from '@models';

export const CategoryApi = createApi({
  reducerPath: 'CategoryApi',
  baseQuery: baseQuery(),
  tagTypes: ['category'],
  endpoints: build => ({
    get: build.query<ApiResponse<Category[]>, void>({
      query: () => ({
        url: '/common/category',
        method: 'GET',
      }),
    }),
  }),
});
