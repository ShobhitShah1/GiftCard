import React from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { Category, RootStackParamList } from '@models';
import { Pressable, View, Image, Text, FlatList } from 'react-native';
import { CategoryApi } from '@services/api';

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

export const CategoryList = () => {
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
