import { Page } from '@components';
import { RootStackParamList } from '@models';
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const SuccessOrderScreen: React.FC = () => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'SUCCESS_ORDER'>>();
  return (
    <Page>
      <View className="flex items-center mt-5 px-5">
        <View className="flex flex-row justify-center items-center rounded-full w-[40px] h-[40px] bg-green-500">
          <Icon
            name="check"
            size={18}
            style={{
              fontWeight: 'bold',
              color: '#fff',
            }}
          />
        </View>
        <Text className="text-center font-target-bold text-dark text-lg mt-5">
          Order Success!
        </Text>
        <Text className="text-center text-gray-600 text-lg mt-1">
          Thank you for completing your manual order.
        </Text>
        <Pressable
          className="mt-5 rounded-full px-12 bg-red-600 active:bg-red-500 py-2"
          onPress={() => {
            navigation.dispatch(StackActions.popToTop());
          }}>
          <Text className="text-white font-semibold">Back</Text>
        </Pressable>
      </View>
    </Page>
  );
};

export default SuccessOrderScreen;
