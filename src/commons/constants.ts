import { Platform } from 'react-native';

export const Screen = {
  INDEX: 'HOME_INDEX',
  HOME: 'HOME',
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  VERIFICATION: 'VERIFICATION',
  EXPLORE: 'EXPLORE',
  ORDER: 'ORDER',
  ORDER_HISTORY: 'ORDER_HISTORY',
  SUCCESS_PAGE: 'SUCCESS_PAGE',
  NOTIFICATION: 'NOTIFICATION',
  PROFILE: 'PROFILE',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  ABOUT_US: 'ABOUT_US',
  CONTACT_US: 'CONTACT_US',
  DELETE_ACCOUNT: 'DELETE_ACCOUNT',
  SELECTION: 'SELECTION',
  ITEMDELIVERY: 'ITEMDELIVERY',
  CARTITEM: 'CARTITEM',
  TABSTACK: 'TABSTACK',
  TELEBIRR: 'TELEBIRR',
};

export const Images = {
  LOGO: require('@assets/images/logo.png'),
  NEWLOGO: require('@assets/images/NewLogo.png'),
  PAYPALLOGO: require('@assets/images/paypal.png'),
  CHECK: require('@assets/images/check.png'),
  TELEBIRR: require('@assets/images/Telebirr.png'),
  MASTERCARD: require('@assets/images/card.png'),
  VISA: require('@assets/images/visa.png'),
  GPAY: require('@assets/images/googlepay.png'),
  APPLEPAY: require('@assets/images/apple-pay.png'),
  image: require('@assets/images/img.png'),
  STRIPE: require('@assets/images/stripe.png'),
  G_PAY: require('@assets/images/google-pay.png'),
  APPLE_PAY: require('@assets/images/applepay.png'),
  MAIN_STRIPE: require('@assets/images/MainStripe.png'),
  RIGHT_ARROW: require('@assets/images/rightarrow.png'),
  AMOUNT_BG: require('@assets/images/AmountBg.png'),
  DELIVERY: require('@assets/images/Delivery.png'),
  GIFTCARD: require('@assets/images/GiftCard.png'),
  ADDCART: require('@assets/images/add-to-cart.png'),
  TELEBIRRNEW: require('@assets/images/TelebirrNewLogo.png'),
  FETANLOGO: require('@assets/images/FetanLogo.png'),
};
const BASE_URL =
  Platform.OS === 'android' ? 'https://fetangift.com' : 'https://fetangift.com';

export const Config = {
  BASE_URL: BASE_URL,
  API_URL: `${BASE_URL}/public/api`,
  REQUEST_TIMEOUT: 60000,
  SecretKey: '7q3koDuZzmOiILgPyPpAs07ZdB61n8QuNyTFpFOqLQ',
  publishableKey:
    'pk_test_51OA7DGFL73yFtZ5MUfxp20SBTPT3VFSX3XJIVJhM93QbLRqmoQ9qr8T4TsmA6arHfONejNshTbetEb42Pnucaobv00u3gN1vpk',
  merchantIdentifier: 'merchant.com.fetangift.fetangift',
  Client_publishableKey:
    'pk_test_51NJpsAC2tsGbUofV8rNiU7tzeZYqpjLj81RvNEcyTJJgqWcws8GBn8ALiMrw7LQni2V2M3guRlX1ETYtlULyvnEB00g0Wlyl7E',
  Client_Live_publishableKey:
    'pk_live_51NJpsAC2tsGbUofVS2TIMkEx984pyVjC351AozEO3R9bOp7Ty50Nt6nlw0Z9tHfdi6pZMHPqRY9Oo7ebOhSRz7vn004itUI1Mv',
  Client_secretKey:
    'sk_test_51NJpsAC2tsGbUofVD5LUHITljVDrRmdjtPs12I4fFbb2c7cZ68EYFbZ2pVt6F94n4NBnlKR0lKkDsepBncgTxF8t000YVgJZEp',
};

// 783731
