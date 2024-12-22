import axios from 'axios';
import { Config } from '@common/constants';
import { store } from './store';
import { setCredentials } from './slice/auth';
import { toast } from '@backpackapp-io/react-native-toast';

const WService = axios.create({
  baseURL: `${Config.API_URL}`,
  timeout: Config.REQUEST_TIMEOUT,
  withCredentials: true,
});

//Global handler api request
WService.interceptors.response.use(undefined, function (error) {
  const statusCode = error.response ? error.response.status : null;
  const errorResponse = {
    status: statusCode,
    message: error.message,
  };

  if (statusCode === 404) {
    errorResponse.message =
      'Oops, something has error. please contact administrator.';
  }
  if (statusCode === 401) {
    errorResponse.message = 'Unauthorized token';
    const states = store.getState();
    if (states.auth) {
      const { _token } = states.auth;
      if (_token) {
        toast.error("You're signed out, please login.", { id: 'auth' });
      }
    }
    store.dispatch(
      setCredentials({
        user: null,
        _token: null,
      }),
    );
    // localStorage.clear();
  }

  if (statusCode === 400) {
    errorResponse.message = error?.response?.data?.message || '';
    // console.clear()
  }

  if (statusCode === 403) {
    errorResponse.message =
      error?.response?.data?.message || 'Access forbidden';
    // console.clear()
  }

  if (statusCode === 500) {
    errorResponse.message =
      error?.response?.data?.message ||
      'Internal server error, please try again.';
    // console.clear()
  }

  if (!error?.response?.data?.message) {
  }

  return Promise.reject(errorResponse);
});

/** request auth */
WService.interceptors.request.use(function (config) {
  const states = store.getState();
  if (states.auth) {
    const { _token } = states.auth;
    // console.log('token **********', _token);
    if (_token) {
      config.headers!.Authorization = `Bearer ${_token}`;
    }
  }
  config.headers['X-Secret-Key'] = Config.SecretKey;
  return config;
});

export default WService;
