import { Images, Screen } from '@common/constants';
import {
  DrawerActions,
  NavigationProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { PropsWithChildren, useEffect } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
// import ModalDropdown from 'react-native-modal-dropdown';
import DropdownSelect from '@niku/react-native-dropdown-select';
import { CityApi } from '@services/api';
import { cityContext } from '@common/provider';
import { RootStackParamList } from '@models';
import { AccountApi } from '@services/api/account';
import { useAuth } from '@common/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

console = console;

const SigninButton = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      className="absolute right-0 top-0 bottom-0 text-gray-700 active:bg-gray-200 font-medium text-sm px-5 flex flex-col items-center justify-center"
      onPress={() => navigation.navigate(Screen.LOGIN as never)}>
      <View className="flex flex-row">
        <Icon name="user" size={24} color={'rgb(55,65,81)'} />
      </View>
    </Pressable>
  );
};

const PressableComponent = React.forwardRef<any, PropsWithChildren>(
  ({ children, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...props}
        className="active:bg-gray-200 absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center px-5">
        <View className="flex flex-row items-center">
          <Icon name="map-pin" size={16} style={{ marginRight: 2 }} />
          {children}
        </View>
      </Pressable>
    );
  },
);

const CityButton = () => {
  const { data, isLoading } = CityApi.useGetQuery();
  const options = React.useMemo(() => {
    return (data?.data || []).map(item => ({
      label: item.name,
      value: item.id,
    }));
  }, [data]);
  const [cSelected, setCity] = cityContext();
  return (
    <Pressable className="absolute right-0 top-0 bottom-0 text-gray-700 active:bg-gray-200 font-medium text-sm  flex flex-row items-center justify-center border-1 rounded border-gray-900">
      <Icon
        name="map-pin"
        style={{ position: 'absolute', left: -5, top: '38%' }}
        color={'rgb(55,65,81)'}
      />
      <DropdownSelect
        options={[{ label: 'All city', value: 0 }, ...options]}
        defaultValue={cSelected}
        value={0}
        onSelectOption={option => {
          setCity(option.value);
          // setValue(option.value);
        }}
        onHideDropdown={() => {
          console.log('hide');
        }}
        onShowDropdown={() => {
          console.log('show');
        }}
        buttonContainerStyle={{
          right: 0,
          backgroundColor: '#white',
          borderWidth: 0,
          padding: 0,
          maxWidth: 110,
          minWidth: 80,
          width: '100%',
        }}
        buttonLabelStyle={{
          fontSize: 12,
        }}
        buttonIconStyle={{
          padding: 0,
          backgroundColor: '#fff',
          position: 'absolute',
          width: 10,
        }}
        placeholder={''}
        buttonPlaceholderStyle={{
          backgroundColor: '#fff',
        }}
        dropdownStyle={{
          width: 128,
          marginLeft: -56,
          marginTop: 18,
        }}
        optionLabelStyle={{
          color: 'rgb(55,65,81)',
        }}
      />
    </Pressable>
  );
};

const NotifButton = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { authenticated } = useAuth();
  const [checkUnread, { data }] = AccountApi.useLazyUnreadNotificationQuery();
  const isFocus = useIsFocused();
  useEffect(() => {
    if (authenticated && isFocus) {
      checkUnread();
    }
  }, [isFocus, authenticated, checkUnread]);
  return (
    <Pressable
      className="absolute right-0 top-0 bottom-0 text-gray-700 active:bg-gray-200 font-medium text-sm px-5 flex flex-col items-center justify-center"
      onPress={() => navigation.navigate('NOTIFICATION')}>
      {data?.data && data.data.count > 0 && (
        <Text
          className="h-5 w-5 text-sm bg-primary z-999 border border-white shadow-sm rounded-full absolute top-1 right-3.5 text-white font-target-bold flex-row text-center text-[11px] items-center justify-center"
          style={{ overflow: 'hidden', borderRadius: 10, lineHeight: 18 }}>
          {data.data.count}
        </Text>
      )}
      <View className="flex flex-row">
        <Icon name="bell" size={24} color={'rgb(55,65,81)'} />
      </View>
    </Pressable>
  );
};

export const Header: React.FC<{
  right?: 'N' | 'P' | 'C';
}> = ({ right }) => {
  const route = useRoute();
  const { authenticated } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const inset = useSafeAreaInsets();
  return (
    <View className="absolute bg-white top-0 z-10 left-0 right-0 shadow">
      <View className="h-[10px] bg-primary" />
      <View
        className="flex bg-white flex-row justify-center h-[55px] border-b border-gray-100 "
        // eslint-disable-next-line react-native/no-inline-styles
      >
        <Pressable
          className="absolute left-0 top-0 bottom-0 text-gray-700 active:bg-gray-200 font-medium text-sm px-5 flex flex-col items-center justify-center"
          onPress={() => {
            navigation.canGoBack() &&
            route.name !== 'HOME_INDEX' &&
            route.name !== 'PROFILE'
              ? navigation.goBack()
              : navigation.dispatch(DrawerActions.openDrawer());
          }}>
          <Icon
            name={
              navigation.canGoBack() &&
              route.name !== 'HOME_INDEX' &&
              route.name !== 'PROFILE'
                ? 'chevron-left'
                : 'menu'
            }
            size={24}
            color={'rgb(55,65,81)'}
          />
        </Pressable>
        <Image
          source={Images.LOGO}
          className={'h-[55px] object-contain w-[40vw] '}
          resizeMode={'contain'}
        />
        {/* <SigninButton /> */}
        {right === 'C' && <CityButton />}
        {right === 'N' && authenticated && <NotifButton />}
        {right === 'N' && !authenticated && <SigninButton />}
      </View>
    </View>
  );
};
