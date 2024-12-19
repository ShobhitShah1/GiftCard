import {
  DrawerActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { useAuth } from '@common/hooks';
import { View, SafeAreaView, Text, Pressable } from 'react-native';
import { RootStackParamList } from '@models';
import { StatusBar } from 'react-native';
import { MenuItem } from './menu-item';
import React from 'react';
import { CategoryList } from './category';
import Icon from 'react-native-vector-icons/Feather';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export const DrawerContent = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    authenticated,
    action: { logout },
  } = useAuth();
  return (
    <View className="relative h-screen">
      <SafeAreaView className="h-screen flex flex-col justify-between">
        <View
          className="pb-4 px-2"
          style={{ marginTop: (STATUSBAR_HEIGHT || 0) + 20 }}>
          <View className="relative">
            <Text className="font-target-bold text-dark font-bold text-lg">
              Categories
            </Text>
            <CategoryList />
            <View className="mt-3">
              {!authenticated && (
                <MenuItem icon="user" to="LOGIN" title={'Sign in'} />
              )}
              {authenticated && (
                <>
                  <MenuItem
                    icon="gift"
                    to="ORDER_HISTORY"
                    title={'Purchase History'}
                  />
                  <MenuItem
                    icon="user"
                    onPress={() => {
                      navigation.navigate('ACCOUNT_TAB', { screen: 'PROFILE' });
                    }}
                    title={'My Accounts'}
                  />
                  <MenuItem
                    icon="lock"
                    to="CHANGE_PASSWORD"
                    title={'Change Password'}
                  />
                </>
              )}
              <MenuItem icon="info" to="ABOUT_US" title={'About Us'} />
              {authenticated && (
                <MenuItem
                  icon="trash-2"
                  to="DELETE_ACCOUNT"
                  title={'Delete Account'}
                />
              )}
              <MenuItem icon="mail" to="CONTACT_US" title={'Contact Us'} />
              {authenticated && (
                <MenuItem
                  icon="log-out"
                  onPress={() => {
                    logout();
                  }}
                  title={'Sign out'}
                />
              )}
            </View>
          </View>
          <Pressable
            className="text-gray-400 bg-transparent hover:bg-gray-200 active:bg-gray-200 active:text-gray-900 rounded-lg text-sm p-1.5 absolute top-0 right-2.5 inline-flex items-center"
            onPress={() => {
              navigation.dispatch(DrawerActions.closeDrawer());
            }}>
            <Icon name="x" size={24} />
          </Pressable>
        </View>
        <Text
          className="text-center mx-5 text-[12px] font-target-medium leading-relaxed"
          style={{ lineHeight: 18 }}>
          By joining Fetan Gift you{'\n'}agreed to with our{' '}
          <Text
            className="text-blue-700"
            onPress={() => navigation.navigate('TERMS')}>
            Terms and Conditions
          </Text>{' '}
          and{' '}
          <Text
            className="text-blue-700"
            onPress={() => navigation.navigate('PRIVACY_POLICY')}>
            Privacy Policy
          </Text>{' '}
          of Fetan gift{' '}
        </Text>
      </SafeAreaView>
    </View>
  );
};
