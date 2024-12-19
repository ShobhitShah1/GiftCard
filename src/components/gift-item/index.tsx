import type { Merchant, RootStackParamList } from '@models';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';

export const GiftItem = (props: { item: Merchant }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EXPLORE'>>();
  // console.log("props image ****************************",props.item.image)
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Pressable 
      className="flex flex-row rounded-lg shadow border-b-[0.5px] border-r-[0.5px] border-gray-800/10 bg-white w-full mb-3 active:opacity-[0.9] active:bg-gray-50"
      onPress={() => {
        navigation.navigate('SELECTION', {
          merchant: props.item,
          categoryId: route.params?.categoryId || 0,
        });
      }}>
      {/* <Image
        source={{
          uri: props.item.image,
        }}
        className="w-[28%] h-full rounded-l-lg"
        resizeMode="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      /> */}
       <FastImage
        source={{
          uri: props.item.image,
          priority: FastImage.priority.normal,
        }}
        className="w-[28%] h-full rounded-l-lg"
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            width: '28%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <ActivityIndicator size="small" color="black" />
        </View>
      )}
      <View className="p-[10px] items-start">
        <Text className="bg-blue-100 text-blue-800 mb-1 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          {props.item.category.name}
        </Text>
        <Text className="font-bold text-[#333] text-[16px] my-1">
          {props.item.name}
        </Text>
        <View className="flex flex-row items-center">
          <Icon name="map-pin" size={12} color={'rgb(55,65,81)'} />
          <Text className="ml-1 text-gray-600 text-sm">
            {props.item.city.name}
            {props.item.town ? `, ${props.item.town.name}` : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
