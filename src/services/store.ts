import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import {
  auth,
  BizCategoryApi,
  CategoryApi,
  CityApi,
  GiftCardApi,
  OrderApi,
} from './api';
import { AccountApi } from './api/account';
import { ContactApi } from './api/contact';

const persistConfig = {
  key: '_rp',
  version: 1.0,
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: '__rp',
      },
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      thunk,
      auth.middleware,
      CityApi.middleware,
      CategoryApi.middleware,
      BizCategoryApi.middleware,
      GiftCardApi.middleware,
      OrderApi.middleware,
      AccountApi.middleware,
      ContactApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
