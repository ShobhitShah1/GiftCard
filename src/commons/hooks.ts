/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '@services/api';
import { useCallback, useEffect } from 'react';
import {
  setCredentials,
  selectCurrentUser,
  setDeviceToken,
} from '@services/slice/auth';
import type { AuthState, User } from '@models';
import { toast } from '@backpackapp-io/react-native-toast';
import { PayloadAction } from '@reduxjs/toolkit';
import { AccountApi } from '@services/api/account';
import { getDeviceToken, notifyMessage } from './helper';

/**
 * [user, action: {login: {isLoading}, }]
 */

type actionType = {
  //   login: ReturnType<typeof useLoginMutation>[0];
  login(params: any, alert?: boolean): void;
  state: Pick<ReturnType<typeof useLoginMutation>[1], 'error' | 'isLoading'>;
  logout: () => void;
  setUser: (params: any) => void;
  getMe: () => void;
  updateUser: (params: any) => void;
};

export type useAuthType = {
  authenticated: boolean | null;
  user: User | null;
  action: actionType;
  verified: boolean;
  _token: string | null;
};

export const useAuth = (): useAuthType => {
  const dispatch = useDispatch();
  const [_login, { data, error, isLoading }] = useLoginMutation();
  const auth = useSelector(selectCurrentUser);
  const [_updateUser, updateState] = AccountApi.useUpdateMutation();
  const [_getMe, accState] = AccountApi.useLazyMeQuery();
  const [_signout, logoutState] = AccountApi.useSignoutMutation();
  const token = useDeviceToken();
  const logout = () => {
    _signout({ token: token || '' }).then(e => {
      dispatch(
        setCredentials({
          user: null,
          _token: null,
        }),
      );
      toast.success('Your account successfully signout.');
    });
  };

  const updateUser = (args: any) => {
    toast.loading('Saving update...', { id: 'update-loader' });
    return _updateUser(args)
      .unwrap()
      .then(x => {
        if (x.data) {
          dispatch(setCredentials({ user: x.data, _token: auth?._token }));
          toast.success(x.message || '', { id: 'update-user' });
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        toast.dismiss('update-loader');
      });
  };

  const getMe = () => {
    return _getMe()
      .unwrap()
      .then(({ data }) => {
        if (data) {
          dispatch(setCredentials({ user: data, _token: auth?._token }));
        }
      })
      .catch(err => {});
  };

  const login = (params: any, alert = false) => {
    return _login(params)
      .unwrap()
      .then(res => {
        if (res?.data) {
          dispatch(setCredentials(res.data));
        }
      })
      .catch(err => {
        if (alert) {
          notifyMessage(err.message);
        }
      });
  };
  //   useEffect(() => {
  //     if (data?.data) {
  //     }
  //   }, [data]);
  const setUser = (params: any) => {
    dispatch(setCredentials(params));
  };

  return {
    authenticated: auth?._token ? true : false,
    verified: (auth.user?.status || 0) < 1 ? false : true,
    user: auth.user,
    _token: auth._token,
    action: {
      login,
      state: {
        isLoading,
        error,
      },
      logout,
      setUser,
      getMe,
      updateUser,
    },
  };
};

export const useDeviceToken = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectCurrentUser);
  if (!auth.deviceToken) {
    getDeviceToken()
      .then(token => {
        dispatch(setDeviceToken(token));
      })
      .catch(err => {
        toast.error("couldn't get token info", {
          id: 'deviceTokenError',
        });
      });
  }

  return auth.deviceToken;
};
