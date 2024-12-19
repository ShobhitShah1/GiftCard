import { Config } from '@common/constants';
import { useAuth } from '@common/hooks';
import { RootStackParamList } from '@models';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddCartScreen from '../../Screens/AddCartScreen';
import ContactUs from '../../Screens/ContactUs';
import DeleteAccount from '../../Screens/DeleteAccount';
import ItemDeliveryScreen from '../../Screens/ItemDelivery';
import OfflineOrderScreen from '../../Screens/OfflineOrderScreen';
import OrderScreen from '../../Screens/OrderScreen';
import OtpScreen from '../../Screens/OtpScreen';
import PaymentScreen from '../../Screens/PaymentScreen';
import SelectionScreen from '../../Screens/SelectionScreen';
import SuccessOrderScreen from '../../Screens/SuccessOrderScreen';
import TelebirrScreen from '../../Screens/TelebirrScreen';
import WebViewScreen from '../../Screens/WebViewScreen';
import { DrawerRoute } from './sidebar-stack';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const MainRoute = () => {
  const {
    authenticated,
    verified,
    action: { getMe },
  } = useAuth();
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {authenticated && !verified && (
        <>
          <RootStack.Screen name={'VERIFICATION'} component={OtpScreen} />
        </>
      )}
      <RootStack.Screen name={'ROOT'} component={DrawerRoute} />
      <RootStack.Screen name={'SELECTION'} component={SelectionScreen} />
      <RootStack.Screen name={'ORDER'} component={OrderScreen} />
      <RootStack.Screen name={'ITEMDELIVERY'} component={ItemDeliveryScreen} />
      <RootStack.Screen name={'CARTITEM'} component={AddCartScreen} />
      <RootStack.Screen name={'OFFLINE_ORDER'} component={OfflineOrderScreen} />
      <RootStack.Screen name={'SUCCESS_ORDER'} component={SuccessOrderScreen} />
      <RootStack.Screen name={'PAYMENT'} component={PaymentScreen} />
      <RootStack.Screen name={'TELEBIRR'} component={TelebirrScreen} />
      <RootStack.Screen
        initialParams={{ url: Config.BASE_URL + '/mobile/about-us' }}
        name={'ABOUT_US'}
        component={WebViewScreen}
      />
      <RootStack.Screen
        initialParams={{ url: Config.BASE_URL + '/mobile/terms' }}
        name={'TERMS'}
        component={WebViewScreen}
      />
      <RootStack.Screen
        initialParams={{ url: Config.BASE_URL + '/mobile/privacy-policy' }}
        name={'PRIVACY_POLICY'}
        component={WebViewScreen}
      />
      <RootStack.Screen name={'CONTACT_US'} component={ContactUs} />
      <RootStack.Screen name={'DELETE_ACCOUNT'} component={DeleteAccount} />
    </RootStack.Navigator>
  );
};
