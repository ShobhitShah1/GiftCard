/* eslint-disable react-hooks/exhaustive-deps */
import { Card } from '@models';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  card?: Card;
  onSubmit(): void;
  fee?: number;
  withUSD?: boolean;
  currency_type?: string;
  Mode?: String;
  paymentName?: String;
};
export const CheckoutButton: React.FC<Props> = ({
  fee,
  card,
  onSubmit,
  withUSD,
  currency_type,
  Mode,
  paymentName,
}) => {
  const isPaymentSelected = paymentName !== undefined;

  // console.log("card ***************",card)

  const total = React.useMemo(() => {
    // const currAmount =
    //   Mode === 'Online'
    //     ? card?.amount?.amount_usd
    //     : withUSD
    //     ? card?.amount?.amount_usd
    //     : card?.amount.amount;
    const currAmount =
      Mode === 'Online'
        ? paymentName === 'paypal' || paymentName === 'stripe'
          ? card?.amount?.amount_usd
          : card?.amount?.amount
        : card?.amount?.amount;

    // console.log('currAmountcurrAmount', currAmount);
    const amt = parseFloat((currAmount || 0)?.toString());
    const feeamt =
      Mode === 'Online'
        ? paymentName === 'paypal' || paymentName === 'stripe'
          ? card?.amount?.commission_usd
          : card?.amount?.fee || 0
        : card?.amount?.fee || 0;
    // console.log('feeamt ************', feeamt);
    const fees = (parseFloat(feeamt?.toString()) / 100) * amt;
    return amt + fees;
  }, [card?.amount?.fee, card, withUSD, paymentName]);

  // const total = React.useMemo(() => {
  //   console.log('paymentName ----------------------->',  paymentName);
  //     console.log('paymentName ----------------------->', paymentName?.length);
  //   const currAmount =
  //     Mode === 'Online'
  //       ? paymentName === 'paypal'
  //         ? card?.amount?.amount_usd
  //         : paymentName === 'stripe'
  //         ? card?.amount?.commission_usd
  //         : card?.amount?.amount
  //       : card?.amount?.amount;

  //   const amt = parseFloat((currAmount || 0)?.toString());
  //   const feeamt =
  //     Mode === 'Online'
  //       ? paymentName === 'paypal'
  //         ? card?.amount?.commission_usd
  //         : paymentName === 'stripe'
  //         ? card?.amount?.commission_usd
  //         : card?.amount?.fee || 0
  //       : card?.amount?.fee || 0;

  //   const fees = (parseFloat(feeamt?.toString()) / 100) * amt;
  //   return amt + fees;
  // }, [card?.amount?.fee, card, withUSD, paymentName, Mode]);

  const isPaymentNameEmpty = paymentName?.length === 0;
  // console.log(isPaymentNameEmpty);
  return (
    <>
      <View
        className={
          'absolute bottom-0 min-h-[50px] left-0 right-0 z-1 px-2 pb-8'
        }>
        <Pressable
          className={`bg-primary active:bg-primary-accent text-white px-3 pl-5 py-3 flex flex-row shadow-lg items-center justify-between rounded-full disabled:opacity-50 ${
            !card && 'opacity-40'
          }`}
          onPress={onSubmit}
          disabled={isPaymentNameEmpty}>
          {/* {Mode === 'Online' ? !card && isPaymentNameEmpty :  !card &&  (
            <Text className="font-target-bold text-red-100">Choose Amount</Text>
          )} */}
          {Mode === 'Online' ? (
            !card && isPaymentNameEmpty ? (
              <Text className="font-target-bold text-red-100">
                Choose Amount
              </Text>
            ) : null
          ) : !card ? (
            <Text className="font-target-bold text-red-100">Choose Amount</Text>
          ) : null}
          {card && (
            <View>
              {(Mode === 'Online' && paymentName == 'paypal') ||
              paymentName === 'stripe' ? (
                <Text className="font-target-bold text-[14px] text-white border-b border-red-200/30 pr-3">
                  {card?.amount?.amount_usd} USD
                </Text>
              ) : currency_type == 'USA' ? (
                <Text className="font-target-bold text-[14px] text-white border-b border-red-200/30 pr-3">
                  {card?.amount?.amount_usd} USD
                </Text>
              ) : (
                <Text className="font-target-bold text-[14px] text-white border-b border-red-200/30 pr-3">
                  {card.amount.amount} ETB
                </Text>
              )}
              <Text className="text-red-300/80 font-target-bold text-[10px]">
                {Mode === 'Online'
                  ? paymentName === 'paypal' || paymentName === 'stripe'
                    ? `${card?.amount?.amount_usd} USD`
                    : `${card?.amount?.amount}`
                  : withUSD
                  ? `${card.amount.amount_usd} USD`
                  : 'Pay to Agent'}
              </Text>
            </View>
          )}
          <View className="flex flex-row items-center">
            <Text className="font-target-bold text-[14px] text-white">
              {isNaN(total) ? `${'0.00'}` : total.toFixed(2)}{' '}
              {/* {Mode === 'Online' ? 'USD' : withUSD ? 'USD' : 'Birr'} */}
              {Mode === 'Online'
                ? paymentName === 'paypal' || paymentName === 'stripe'
                  ? 'USD'
                  : 'ETB'
                : 'ETB'}
            </Text>
            <Text
              style={{ marginTop: -15 }}
              className={'font-target text-[9px] text-red-200'}>
              (Fee{' '}
              {(Mode === 'Online' && paymentName == 'paypal') ||
              paymentName === 'stripe'
                ? card?.amount?.commission_usd
                : card?.amount?.fee || 0}
              %)
            </Text>
            <Icon name="chevron-right" size={24} color={'#fff'} />
          </View>
        </Pressable>
      </View>
    </>
  );
};
