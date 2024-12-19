import { RootStackParamList } from '@models';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, PressableProps } from 'react-native';

export const Link: React.FC<
  PressableProps & { to: keyof RootStackParamList }
> = ({ onPress, to, ...props }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      {...props}
      onPress={() => {
        navigation.dispatch(DrawerActions.closeDrawer());
        navigation.navigate(to as never);
      }}
    />
  );
};
