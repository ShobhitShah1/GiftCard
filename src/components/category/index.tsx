import { Screen } from '@common/constants';
import type { Category, RootStackParamList } from '@models';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, View, Text } from 'react-native';

type Props = {
  item: Category;
  index: number;
};

export const CategoryItem: React.FC<Props> = ({ item, index }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const color = index % 2 ? '#eff6d6' : '#d8ecfe';
  return (
    <View className="w-1/2 my-2 px-2 aspect-[4/3]">
      <Pressable
        className={
          'relative overflow-hidden active:opacity-[0.6] p-[10px] w-full rounded-[10px] flex-1 flex flex-row justify-center pb-[25%] items-center'
        }
        style={{
          backgroundColor: color,
        }}
        onPress={() =>
          navigation.navigate('EXPLORE', {
            categoryId: item.id,
          })
        }>
        <Image
          source={{
            uri: item.image,
          }}
          className="h-[90%] w-full"
          resizeMode="contain"
        />
        <Text className="font-target-bold absolute bottom-[15%] w-full px-1 text-[16px] text-dark font-bold text-center">
          {item.name}
        </Text>
      </Pressable>
    </View>
  );
};
