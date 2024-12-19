import { Screen } from '@common/constants';
import type { Cart, Merchant } from './gift-card';

export type IScreenName = keyof typeof Screen;

export type RootStackParamList = {
  //   [K in IScreenName]: undefined;
  // } & {
  ROOT: undefined;
  HOME_ROOT: undefined;
  HOME_INDEX: undefined;
  ACCOUNT_TAB: { screen: string } | undefined;
  AUTH: undefined;
  HOME: undefined;
  LOGIN: undefined;
  REGISTER: undefined;
  TABSTACK: undefined;
  FORGOT_PASSWORD: undefined;
  VERIFICATION: undefined;
  EXPLORE: { categoryId: number } | undefined;
  ORDER_HISTORY: undefined;
  SUCCESS_PAGE: undefined;
  NOTIFICATION: undefined;
  PROFILE: undefined;
  ORDER: { merchant: Merchant; categoryId?: number };
  OFFLINE_ORDER: { merchant: Merchant; categoryId?: number };
  MODE: String;
  SUCCESS_ORDER: undefined;
  PAYMENT: { url: string };
  CHANGE_PASSWORD: undefined;
  ABOUT_US: { url: string };
  PRIVACY_POLICY: { url: string } | undefined;
  TERMS: { url: string } | undefined;
  WEBVIEW: { url: string };
  CONTACT_US: undefined;
  DELETE_ACCOUNT: undefined;
  SELECTION: { merchant: Merchant; categoryId?: number };
  ITEMDELIVERY: { merchant: Merchant; categoryId?: number };
  CARTITEM: {
    merchant: Merchant;
    categoryId?: number;
    cartItem: any[];
    cartCount: number;
    deliveryFee: string;
    DeliveryFee_usd: string;
    Currency: string;
  };
  TELEBIRR: { card: undefined; uuid: string; type: string };
};
