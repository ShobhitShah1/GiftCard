import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../rootReducer';
import type { User } from '@models';

type AuthState = {
  user: User | null;
  _token: string | null;
  deviceToken?: string | null;
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState: { user: null, _token: null, deviceToken: null } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, _token } }: PayloadAction<AuthState>,
    ) => {
      state.user = user;
      state._token = _token;
    },
    setDeviceToken: (state, { payload: deviceToken }) => {
      state.deviceToken = deviceToken;
    },
  },
});

export const { setCredentials, setDeviceToken } = AuthSlice.actions;
export default AuthSlice.reducer;
export const selectCurrentUser = (state: RootState) => state.auth;
