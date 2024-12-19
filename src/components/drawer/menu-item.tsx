import React from 'react';
import { RootStackParamList } from '@models';
import {
  NavigationProp,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import { Link } from './link';
import Icon from 'react-native-vector-icons/Feather';
import { Pressable, Text } from 'react-native';

type MenuIconType = {
  icon: string;
  title: string;
} & (
  | {
      to: keyof RootStackParamList;
      onPress?(): void;
    }
  | { to?: keyof RootStackParamList; onPress(): void }
);

export const MenuItem: React.FC<MenuIconType> = props => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
        className="flex flex-row items-center p-2 text-base font-normal  rounded-lg active:bg-gray-100 ">
        <Icon name={props.icon} className="mr-2" size={16} />
        <Text className="flex-1 ml-3 text-gray-600 whitespace-nowrap font-bold font-target-bold">
          {props.title}
        </Text>
      </Pressable>
    );
  }
};
