import { Page } from '@components';
import React from 'react';
import { Image, StatusBar, View, Text } from 'react-native';
import { Images } from '@common/constants';

const SplashScreen: React.FC = () => {
  return (
    <View className="bg-primary flex-1 h-screen justify-center">
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'light-content'} 
      />
      <Image
        source={Images.FETANLOGO}
        style={{
          height: 150,
          width: '100%',
          resizeMode: 'contain',
          tintColor: '#fff',
        }}
      />

      <Text className="absolute bottom-[25px] flex-1 text-center w-full text-white font-target-medium">
        From Fetan Technology LLC
      </Text>
    </View>
  );
};

export default SplashScreen;
