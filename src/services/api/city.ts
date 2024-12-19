import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import type { ApiResponse, City } from '@models';

export const CityApi = createApi({
  reducerPath: 'cityApi',
  baseQuery: baseQuery(),
  tagTypes: ['city'],
  endpoints: build => ({
    get: build.query<ApiResponse<City[]>, void>({
      query: () => ({
        url: '/common/city',
        method: 'GET',
      }),
    }),
  }),
});
