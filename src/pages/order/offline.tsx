/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from '@backpackapp-io/react-native-toast';
import { Page } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, RootStackParamList } from '@models';
import {
  NavigationProp,
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { GiftCardApi, OrderApi } from '@services/api';
import { store } from '@services/store';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { FieldValues, useController, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { AgentVerifyModal } from './agent-verify';
import { MerchantDetail } from './card-detail';
import { CheckoutButton } from './checkout-button';
import { OfflineModeValidation, OrderForm, validation } from './order-form';

const AmountItem: React.FC<{
  card: Card;
  selected?: boolean;
  onSelect(card: Card): void;
}> = ({ card, onSelect, selected }) => {
  // console.log('cardcard', card);
  const [active, setActive] = useState(false);
  return (
    <Pressable
      className={`relative mx-1 mb-2 whitespace-nowrap flex-col cursor-pointer items-center  bg-white border border-gray-500  active:bg-gray-100 rounded-lg text-sm px-3 py-1.5 active:border-blue-600 active:font-semibold ${
        selected && 'border-blue-600'
      }`}
      onPress={() => onSelect(card)}
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}>
      <Text
        className={`text-gray-500 font-target-medium ${
          (active || selected) && 'text-blue-600'
        }`}>
        {parseFloat((card?.amount?.amount || 0).toString()).toFixed()} Birr
      </Text>
    </Pressable>
  );
};

interface OfflineProps {
  MODE: String;
}

export const OfflineOrderPage: FC<OfflineProps> = ({ MODE }) => {
  // const { authenticated, verified } = useAuth();
  const router = useRoute<RouteProp<RootStackParamList, 'OFFLINE_ORDER'>>();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitSuccessful, isSubmitted, isSubmitting },
  } = useForm<any>({
    resolver: yupResolver(OfflineModeValidation),
    defaultValues: {
      categoryId: router.params?.categoryId || 0,
    },
  });

  const amountField = useController({
    name: 'cardId',
    control: control,
  });
  const params = router.params.merchant;
  const { data, isLoading, refetch, isFetching } = GiftCardApi.useDetailQuery({
    merchantId: params.id,
  });
  const [cardSelected, setCard] = useState<Card | undefined>();
  const { auth } = store.getState();
  const UserId = auth?.user?.id;

  useEffect(() => {
    // console.log('Merchant Data:', data);
    // console.log('cardSelected Data:', cardSelected);
    setValue('id', UserId ? UserId : null);
  }, [data, cardSelected, UserId]);

  const merchant = React.useMemo(() => {
    if (!data?.data) {
      return params;
    } else {
      return data.data;
    }
  }, [data?.data, params]);

  const [purchaseOrder, state] = OrderApi.useOfflineOrderMutation();

  const [authModalVisible, setAuthModalVisible] = useState(false);

  const [agModalVisible, setAgentModalVisible] = useState(false);

  const checkout = useCallback(
    (force = false, agentId?: undefined | string) => {
      console.log('agentId', agentId);
      if (isSubmitSuccessful || force) {
        // if (authenticated && verified) {
        if (!agentId) {
          setAgentModalVisible(true);
        } else {
          console.log('agent order', getValues());
          purchaseOrder({ ...getValues(), agentId });
          console.log('hello');
        }
        // }
        // else if (authenticated && !verified) {
        //     setAuthModalVisible(true);
        // }
        // else {
        //     setAuthModalVisible(true);
        //   }
      }
    },
    [isSubmitSuccessful, isSubmitted, isSubmitting],
  );
  const onSubmit = (value: FieldValues) => {
    console.log('values offline ******* ', value);
    setValue('id', UserId ? UserId : null);
    checkout(true);
  };

  useEffect(() => {
    if (state.isSuccess && state.data?.data) {
      toast.success(state.data?.message || '');
      navigation.dispatch(StackActions.replace('SUCCESS_ORDER'));
    }
  }, [state.data?.data]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  //submit process;
  // useEffect(() => {
  //   if (authenticated && !prevAuthenticated && isSubmitSuccessful) {
  //     setAuthModalVisible(false);
  //     checkout();
  //   }
  // }, [authenticated, prevAuthenticated]);

  return (
    <Page
      onRefresh={refetch}
      pageLoader={state.isLoading}
      contentBottom={
        <CheckoutButton
          card={cardSelected}
          onSubmit={handleSubmit(onSubmit)}
          fee={data?.fee}
          Mode={MODE}
        />
      }>
      <View className={'container mx-auto bg-white py-5 bottom-0 pb-[50]'}>
        <Text
          className={
            'text-center font-target-bold font-bold text-[20px] text-dark'
          }>
          Purchase Gift Card Manual
        </Text>
        <MerchantDetail merchant={merchant} />
        <View className="h-[1px] bg-gray-200" />
        <OrderForm control={control} MODE="offline" />
        <View className="h-[1px] bg-gray-200 my-5" />
        <View className="mb-[60px] px-[20px]">
          <Text className="font-target-bold text-dark text-lg mb-3">
            Select Your Gift Card Amount
          </Text>
          <View>
            {/* <Text className="mb-2 text-sm font-target-medium text-dark">
              Please select amount
            </Text> */}
            {errors.cardId && (
              <View className="bg-red-100 mb-5 border border-red-400 px-4 py-3 rounded relative">
                <Text className="text-red-700">
                  {errors.cardId?.message?.toString() || ''}
                </Text>
              </View>
            )}

            {merchant.cards ? (
              <View className="flex flex-row flex-wrap">
                {merchant.cards.map(e => (
                  <AmountItem
                    key={`amount-${e.id}`}
                    card={e}
                    onSelect={m => {
                      setCard(m);
                      amountField.field.onChange(m.id);
                    }}
                    selected={cardSelected?.id === e.id}
                  />
                ))}
              </View>
            ) : (
              <ActivityIndicator />
            )}
            {(merchant.cards?.length || 0) <= 0 && (
              <View className="bg-red-100 border border-red-400 px-4 py-3 rounded relative">
                <Text className="text-red-700">
                  <Text className="font-target-bold">Oops! </Text>
                  This merchant doesn't have any amount options.
                </Text>
              </View>
            )}

            <View className="flex flex-row justify-center">
              <Pressable
                className="flex-row bg-gray-100 active:bg-gray-200 active:ring-4 active:outline-none active:ring-gray-100  rounded-lg px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
                onPress={() => {
                  navigation.dispatch(
                    StackActions.replace('ORDER', router.params),
                  );
                }}>
                <Icon
                  name="git-pull-request"
                  size={14}
                  style={{ marginRight: 10 }}
                />
                <Text className="text-gray-900 font-medium text-sm">
                  Switch to Online
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      {/* {!prevAuthenticated && !authenticated && (
        <AuthModal
          isVisible={authModalVisible}
          onModalHide={setAuthModalVisible}
        />
      )} */}
      <AgentVerifyModal
        merchant={merchant}
        isVisible={agModalVisible}
        card={cardSelected}
        fee={data?.fee}
        onModalHide={setAgentModalVisible}
        onSuccess={agentId => {
          console.log('OnSuccess Agent Verification:', agentId);
          setAgentModalVisible(false);
          checkout(true, agentId);
        }}
      />
    </Page>
  );
};
