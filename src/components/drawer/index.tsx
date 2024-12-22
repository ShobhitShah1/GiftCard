import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../../Screens/HomeScreen';
import {
  View,
  Text,
  Pressable,
  Image,
  StatusBar,
  PressableProps,
  SafeAreaView,
  FlatList,
  Share,
} from 'react-native';
import { Config, Screen } from '@common/constants';
import Icon from 'react-native-vector-icons/Feather';
import {
  DrawerActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { CategoryApi } from '@services/api';
import { Category, RootStackParamList } from '@models';
import { useAuth } from '@common/hooks';
import { toast } from '@backpackapp-io/react-native-toast';

const Drawer = createDrawerNavigator();

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
// const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const Link: React.FC<PressableProps & { to: keyof typeof Screen }> = ({
  onPress,
  to,
  ...props
}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      {...props}
      onPress={() => {
        navigation.dispatch(DrawerActions.closeDrawer());
        navigation.navigate(Screen[to] as never);
      }}
    />
  );
};

const CategoryItem = (props: { item: Category }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <Pressable
      className="py-4 px-1.5 inline flex flex-col items-center active:bg-gray-100 active:text-red-400"
      onPress={() => {
        navigation.dispatch(DrawerActions.closeDrawer());
        navigation.navigate('EXPLORE', { categoryId: props.item.id });
      }}>
      <View className="w-16 h-16 rounded-full border border-1 border-gray-400 p-3 overflow-hidden">
        <Image
          source={{
            uri: props.item.icon,
          }}
          className={'w-10 h-10'}
          resizeMode="contain"
        />
      </View>
      <Text className="text-center text-gray-700 mt-2 font-medium text-[12px] m-w-17 ">
        {props.item.name}
      </Text>
    </Pressable>
  );
};

const CategoryList = () => {
  const { data } = CategoryApi.useGetQuery();
  return (
    <FlatList
      data={data?.data}
      renderItem={({ item }) => <CategoryItem item={item} />}
      keyExtractor={item => item.id.toString()}
      horizontal
      className="border-b border-gray-200"
    />
  );
};

type MenuIconType = {
  icon: string;
  title: string;
} & (
  | {
      to: keyof typeof Screen;
      onPress?(): void;
    }
  | { to?: keyof typeof Screen; onPress(): void }
);

const MenuItem: React.FC<MenuIconType> = props => {
  const navigation = useNavigation();

  if (typeof props?.to === 'string') {
    return (
      <Link
        to={props.to}
        className="flex flex-row items-center mb-1 p-2 border-b border-gray-200/100 py-3 text-base font-normal  rounded-lg active:bg-gray-100 ">
        <Icon
          name={props.icon}
          className="mr-2"
          size={16}
          color={'rgb(75 85 99)'}
        />
        <Text className="flex-1 ml-3 text-gray-600 whitespace-nowrap font-bold font-target-bold">
          {props.title}
        </Text>
      </Link>
    );
  } else {
    return (
      <Pressable
        onPress={() => {
          navigation.dispatch(DrawerActions.closeDrawer());
          props.onPress();
        }}
        className="flex flex-row items-center mb-1 p-2 border-b border-gray-200/100 text-base font-normal  rounded-lg active:bg-gray-100 ">
        <Icon
          name={props.icon}
          className="mr-2"
          size={16}
          color={'rgb(75 85 99)'}
        />
        <Text className="flex-1 ml-3 text-gray-600 whitespace-nowrap font-bold font-target-bold">
          {props.title}
        </Text>
      </Pressable>
    );
  }
};

export const DrawerContent = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    authenticated,
    action: { logout },
  } = useAuth();

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'Send me gift card',
        message: `Hi.. Send me a gift card \n${Config.BASE_URL}`,
        // url: Config.BASE_URL,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // toast(result.activityType);
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };
  return (
    <View className="relative ">
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
                <MenuItem
                  icon="user"
                  onPress={() => {
                    navigation.navigate('AUTH');
                  }}
                  title={'Sign in'}
                />
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
                      navigation.navigate('ACCOUNT_TAB');
                    }}
                    title={'My Account'}
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
              <MenuItem
                icon="send"
                onPress={onShare}
                title="Send me a giftcard"
              />
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
          style={{ lineHeight: 18, color: 'rgb(75 85 99)' }}>
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

export const SideBar = () => {
  return (
    <Drawer.Navigator
      initialRouteName={Screen.HOME}
      screenOptions={{
        headerShown: false,
        drawerHideStatusBarOnOpen: false,
        swipeEnabled: false,
      }}
      drawerContent={DrawerContent}>
      <Drawer.Screen name={'ROOT'} component={HomeScreen} />
    </Drawer.Navigator>
  );
};
