import { useAuth, useDeviceToken } from '@common/hooks';
import { RootStackParamList } from '@models';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CategoryApi } from '@services/api';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Text, View, BackHandler, StatusBar, SafeAreaView } from 'react-native';
import { CategoryItem, Page } from '../components';
import { getDeviceToken } from '@common/helper';

const HomeScreen: React.FC = () => {
  useDeviceToken(); //retrieve device token
  const { isLoading, data, refetch, isUninitialized } =
    CategoryApi.useGetQuery();

  const { authenticated, verified } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (authenticated) {
      if (!verified) {
        navigation.navigate('VERIFICATION');
      }
    }

  }, [authenticated, navigation, verified]);

  
  return (
    <Page
      pageLoader={!isUninitialized && isLoading}
      onRefresh={refetch}
      isRefresh={isUninitialized && isLoading}
      headerRight={'N'}
      statusBar={{
        backgroundColor: 'rgb(204, 0, 0)',
        barStyle: 'light-content',
      }}>
      <View
        className={
          'container flex flex-col items-center mx-auto py-5 pb-[95px]'
        }>
        <Text className={'font-target-bold font-bold text-[20px] text-dark'}>
          Explore by category
        </Text>
        <View className="flex flex-row mt-5 flex-wrap px-3">
          {data?.data?.map((item, index) => (
            <CategoryItem key={`ctItem-${index}`} item={item} index={index} />
          ))}
        </View>
      </View>
    </Page>
  );
};

export default HomeScreen;
