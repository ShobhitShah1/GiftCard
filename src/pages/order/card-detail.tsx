import { GiveCardImage } from '@components';
import { Merchant } from '@models';
import { View, Text } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';


export const MerchantDetail: React.FC<{ merchant: Merchant }> = ({
  merchant,
}) => {
  return (
    <View className="py-3">
      <View className="flex flex-row justify-center">
        <GiveCardImage merchant={merchant} />
      </View>
      {/* <Text className="mb-1 text-center mt-3 text-lg font-target-bold text-gray-900 dark:text-white">
        {merchant.name}
      </Text> */}
      <View className="flex flex-row justify-center items-center mt-3">
        <Text className="inline-block bg-blue-100 text-blue-800 mb-1 text-xs font-medium  px-2.5 py-0.5 rounded">
          {merchant.category.name}
        </Text>
        <Text className="mb-1 text-xs font-target-medium text-gray-600 px-2.5 py-0.5 flex flex-row">
          <Icon name="map-pin" size={12} color={'#697280'} />
          <>
            {` ${merchant.city.name}`}
            {merchant.town ? `, ${merchant.town.name}` : ''}
          </>
        </Text>
      </View>
    </View>
  );
};
