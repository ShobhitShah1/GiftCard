import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from '../drawer';
import { TabRoute } from './tabs-stack';

const Drawer = createDrawerNavigator();

export const DrawerRoute = () => (
  <Drawer.Navigator
    initialRouteName={'HOME_INDEX'}
    screenOptions={{
      headerShown: false,
      swipeEnabled: false,
    }}
    drawerContent={DrawerContent}>
    <Drawer.Screen name={'HOME_INDEX'} component={TabRoute} />
  </Drawer.Navigator>
);
