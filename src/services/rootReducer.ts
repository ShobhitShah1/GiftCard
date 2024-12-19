import { combineReducers, createReducer } from '@reduxjs/toolkit';
import authReducer from './slice/auth';
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

const rootReducer = combineReducers({
  auth: authReducer,
  [auth.reducerPath]: auth.reducer,
  [CityApi.reducerPath]: CityApi.reducer,
  [CategoryApi.reducerPath]: CategoryApi.reducer,
  [BizCategoryApi.reducerPath]: BizCategoryApi.reducer,
  [GiftCardApi.reducerPath]: GiftCardApi.reducer,
  [OrderApi.reducerPath]: OrderApi.reducer,
  [AccountApi.reducerPath]: AccountApi.reducer,
  [ContactApi.reducerPath]: ContactApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
