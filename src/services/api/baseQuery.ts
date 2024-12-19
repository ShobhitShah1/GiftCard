import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type {
  AxiosRequestConfig,
  AxiosError,
  AxiosRequestHeaders,
} from 'axios';
import WService from '../WServices';

import { toast } from '@backpackapp-io/react-native-toast';

export const baseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestHeaders;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await WService({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      console.log('error', err);
      if (typeof err.status === 'number') {
        if (err?.status === 0) {
          //internet connection or server down
          toast.error("Oops, couldn't connect to server!", { id: 'network' });
          return { error: null };
        }

        if (err.status === 429) {
          //too many request
          toast.error('Too many request, please slow down!', {
            id: 'tooManyRequest',
          });
          return { error: null };
        }

        if (err.status === 403) {
          //too many request
          toast.error(err.message, { id: 'forbidden' });
          return { error: null };
        }

        if (err.status === 404 || err.status === 500) {
          //too many request
          toast.error(
            'Oops, something has error, please contact adminstrator',
            { id: 'not found' },
          );
          return { error: null };
        }

        if (err.status === 400) {
          //too many request
          toast.error(err.message, { id: 'Request error' });
          return {
            error: {
              status: err.status || err.response?.status,
              message: err.message || err.response?.statusText,
            },
          };
        }

        if (err.status === 401) {
          //too many request
          toast.error(err.message, { id: 'Request error' });
          return { error: null };
        }

        if (err.message) {
          toast.error(err.message, { id: 'Request error' });
        }
      } else {
        if (err.message) {
          toast.error(err.message, { id: 'Request error' });
        } else {
          toast.error('Unable to connect with server', { id: 'Request error' });
        }
      }
      return {
        error: {
          status: err.status || err.response?.status,
          message: err.message || err.response?.statusText,
        },
      };
    }
  };
