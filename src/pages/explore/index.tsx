import { cityContext, CityContextProvider } from '@common/provider';
import { GiftItem, Page } from '@components';
import type { BizCategory } from '@models';
import { BizCategoryApi, GiftCardApi } from '@services/api';
import React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const CategoryItem = (props: {
  item: BizCategory;
  selected: BizCategory['id'];
  onSelect(id: BizCategory['id']): void;
}) => {
  const [hover, setHover] = useState(false);
  const isSelected = props.selected === props.item.id;
  return (
    <Pressable
      className={`mx-1 rounded-full border-[1px] px-3 py-1 bg-white border-gray-300 shadow-sm active:border-blue-600  active:bg-gray-50 ${
        props.selected === props.item.id ? 'border-blue-600' : ''
      }`}
      onPressIn={() => setHover(true)}
      onPressOut={() => setHover(false)}
      onPress={() => {
        props.onSelect(props.item.id);
      }}>
      <Text
        className={`text-gray-600 font-target-medium ${
          hover || isSelected ? 'text-blue-600' : ''
        }`}>
        {props.item.name}
      </Text>
    </Pressable>
  );
};

const SearchInput = (props: { onChangeText(text: string): void }) => {
  return (
    <View className="mx-5 relative">
      <TextInput
        className="bg-gray-50 border border-gray-300 text-gray-900 h-10 text-sm rounded-lg  focus:ring-gray-500 focus:border-gray-300 block w-full  pr-10 p-2.5 bg-white focus:shadow-sm"
        style={{ lineHeight: 16, paddingRight: 32, paddingLeft: 16 }}
        placeholder={'Search merchant...'}
        onChangeText={props.onChangeText}
        placeholderTextColor={'#9f9f9f'}
      />
      <Icon
        name="search"
        style={{
          position: 'absolute',
          right: 10,
          top: 10,
        }}
        size={20}
        color={'#9e9e9e'}
      />
    </View>
  );
};

export const Explore = () => {
  const [cityId, setCity] = cityContext();

  const biz = BizCategoryApi.useGetQuery();
  // const [selectedBiz, setSelectedBiz] = useState<number>(0);
  const [filter, setFilter] = useState<{ bizId: number; cityId: number }>({
    bizId: 0,
    cityId: cityId,
  });
  const { isLoading, data, refetch, isUninitialized, isFetching } =
    GiftCardApi.useGetQuery({ ...filter, cityId });
  // console.log("listing data", data)
  const [search, setSearch] = useState<string | undefined>('');

  const listing = React.useMemo(() => {
    if (!data?.data) {
      return undefined;
    }
    if ((data?.data || []).length <= 0) {
      return [];
    }

    return data.data.filter(d =>
      d.name.toLowerCase().includes((search || '').toLowerCase()),
    );
  }, [search, data?.data]);

  return (
    <Page
      pageLoader={isLoading || isFetching}
      onRefresh={refetch}
      isRefresh={!isUninitialized && isLoading}
      headerRight={'C'}
      scrollable={false}>
      <View className={'container mx-auto py-5 bg-gray-50/30 pb-[95px]'}>
        <Text
          className={
            'text-center font-target-bold font-bold text-[20px] text-dark'
          }>
          Explore Gift Cards
        </Text>
        <View className="flex items-center mt-5 w-100">
          <FlatList
            horizontal
            data={[{ id: 0, name: 'All category' }, ...(biz.data?.data || [])]}
            renderItem={({ item }) => (
              <CategoryItem
                item={item}
                selected={filter.bizId}
                onSelect={v => setFilter(prev => ({ ...prev, bizId: v }))}
              />
            )}
            keyExtractor={item => item.id.toString()}
            className="flex flex-row pb-5 mx-1"
          />
          <View className="px-3 w-full mb-5">
            <SearchInput onChangeText={setSearch} />
          </View>
        </View>
        <View className="flex items-center  w-100">
          <ScrollView className="flex flex-col w-full px-3">
            {listing?.map(item => (
              <GiftItem key={`listing-${item.id}`} item={item} />
            ))}
          </ScrollView>
        </View>
      </View>
    </Page>
  );
};
