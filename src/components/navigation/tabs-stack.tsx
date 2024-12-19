import { useAuth } from '@common/hooks';
import { RootStackParamList } from '@models';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ChangePasswordScreen from '../../Screens/ChangePasswordScreen';
import ExploreScreen from '../../Screens/ExploreScreen';
import HistorySreen from '../../Screens/HistoryScreen';
import HomeScreen from '../../Screens/HomeScreen';
import LoginScreen from '../../Screens/LoginScreen';
import NotificationScreen from '../../Screens/NotificationScreen';
import ProfileScreen from '../../Screens/ProfileScreen';
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar';
import Icon from 'react-native-vector-icons/Feather';
import RegisterScreen from '../../Screens/RegisterScreen';
import ForgotPasswordScreen from '../../Screens/ForgotPasswordScreen';
import { Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeleteAccount from '../../Screens/DeleteAccount';
import SelectionScreen from '../../Screens/SelectionScreen';

// Home tab stack
const HomeStack = createNativeStackNavigator<RootStackParamList>();
const AccountStack = createNativeStackNavigator<RootStackParamList>();
const UnAuthorizedStack = createNativeStackNavigator<RootStackParamList>();
const AuthorizedStack = createNativeStackNavigator<RootStackParamList>();

export const AuthorizedRoute: React.FC = () => {
  const { authenticated } = useAuth();
  return (
    <AuthorizedStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AuthorizedStack.Screen name={'PROFILE'} component={ProfileScreen} />
      <AuthorizedStack.Screen
        name="CHANGE_PASSWORD"
        component={ChangePasswordScreen}
      />
    </AuthorizedStack.Navigator>
  );
};

export const UnAuthorizedRoute: React.FC = () => {
  const { authenticated } = useAuth();

  return (
    <UnAuthorizedStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <UnAuthorizedStack.Screen name={'LOGIN'} component={LoginScreen} />
      <UnAuthorizedStack.Screen name={'REGISTER'} component={RegisterScreen} />
      <UnAuthorizedStack.Screen
        name={'FORGOT_PASSWORD'}
        component={ForgotPasswordScreen}
      />
    </UnAuthorizedStack.Navigator>
  );
};

export const HomeStackRoute: React.FC = () => {
  const { authenticated } = useAuth();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name={'HOME_INDEX'} component={HomeScreen} />
      <HomeStack.Screen name={'EXPLORE'} component={ExploreScreen} />
      <HomeStack.Screen name={'SELECTION'} component={SelectionScreen} />
      {authenticated && (
        <>
          <HomeStack.Screen name="ORDER_HISTORY" component={HistorySreen} />
          <HomeStack.Screen
            name={'FORGOT_PASSWORD'}
            component={ForgotPasswordScreen}
          />
          {/* <TabStack.Screen name="PROFILE" component={ProfileScreen} /> */}
          <HomeStack.Screen
            name="NOTIFICATION"
            component={NotificationScreen}
          />
        </>
      )}
    </HomeStack.Navigator>
  );
};

export const AccountStackRoute = () => {
  const { authenticated } = useAuth();
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!authenticated ? (
        <AccountStack.Screen name={'LOGIN'} component={UnAuthorizedRoute} />
      ) : (
        <AccountStack.Screen name={'PROFILE'} component={ProfileScreen} />
      )}
    </AccountStack.Navigator>
  );
};

const Tabs = AnimatedTabBarNavigator();
// const Tabs = createBottomTabNavigator()
const TabBarIcon = (props: any) => {
  return (
    <Icon
      name={props.name}
      size={props.size ? props.size : 24}
      color={props.tintColor}
    />
  );
};

export const TabRoute: React.FC = () => {
  const { authenticated, verified } = useAuth();

  return (
    <Tabs.Navigator
      backBehavior="history"
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
      }}
      initialRouteName="HOME_TAB"
      tabBarOptions={{
        labelStyle: { fontSize: 12, fontWeight: 'bold' },
        activeTintColor: '#FFF',
        inactiveTintColor: 'rgba(255,255,255,.7)',
        activeBackgroundColor: 'rgba(0,0,0,.2)',
        activeTabColor: '#FFF',
        tabStyle: {
          // height: 55,
          // marginBottom: 60,
          // marginHorizontal: 16,
          // borderRadius: 30,
          // padding: 0,
          // flex: 1,
        },
      }}
      appearance={{
        tabBarBackground: 'rgb(204,0,0)',
        bottomPadding: 5,
        topPadding: 5,
        shadow: true,
        floating: true,
      }}>
      <Tabs.Screen
        name="HOME_TAB"
        component={HomeStackRoute}
        options={{
          title: 'HOME',
          tabBarIcon: ({ focused, color }: any) => (
            <TabBarIcon
              size={18}
              focused={focused}
              tintColor={color}
              name="home"
            />
          ),
          style: {
            paddingHorizontal: 100,
          },
        }}
      />
      {authenticated && verified && (
        <Tabs.Screen
          name="ACCOUNT_TAB"
          component={AuthorizedRoute}
          options={{
            title: 'Account',
            headerShow: false,
            tabBarIcon: ({ focused, color }: any) => (
              <TabBarIcon
                size={18}
                focused={focused}
                tintColor={color}
                name="user"
              />
            ),
            tabBarVisible: authenticated,
          }}
        />
      )}

      {!authenticated && (
        <Tabs.Screen
          name="AUTH"
          component={UnAuthorizedRoute}
          options={{
            title: 'Account',
            tabBarIcon: ({ focused, color }: any) => (
              <TabBarIcon
                size={18}
                focused={focused}
                tintColor={color}
                name="user"
              />
            ),
            tabBarVisible: authenticated,
          }}
        />
      )}
    </Tabs.Navigator>
  );
};
