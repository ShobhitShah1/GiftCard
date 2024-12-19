import React from 'react';
import { Page } from '.';
import { View, Text, Pressable, Image, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Images } from '@common/constants';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title: string;
  headerIcon?: string;
  pageLoader?: boolean;
} & React.PropsWithChildren;

export const AuthPage: React.FC<Props> = ({
  children,
  title,
  headerIcon,
  ...props
}) => {
  const navigation = useNavigation();
  return (
    <Page
      header={false}
      pageLoader={props.pageLoader}
      statusBar={{
        backgroundColor: '#fff',
        barStyle: 'dark-content',
      }}>
      <View className="container shadow-none p-[16px] flex relative flex-col items-center  bg-white mx-auto">
        <Pressable
          className="text-gray-400 bg-transparent hover:bg-gray-200 active:bg-gray-200 active:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 left-2.5 inline-flex items-center"
          onPress={() => {
            navigation.goBack();
          }}>
          {headerIcon && (
            <Icon name={headerIcon} size={24} color={'rgb(55,65,81)'} />
          )}
        </Pressable>
        <Image
          source={Images.LOGO}
          className={'h-[60px] w-40'}
          resizeMode={'contain'}
        />
        <Text className="mx-2 text-center font-bold font-target-bold text-[23px] text-dark">
          {title}
        </Text>
        {children}
      </View>
    </Page>
  );
};

AuthPage.defaultProps = {
  headerIcon: 'chevron-left',
};
