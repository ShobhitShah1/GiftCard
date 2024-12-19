/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from '@backpackapp-io/react-native-toast';
import { Config, Images } from '@common/constants';
import { useAuth } from '@common/hooks';
import { Page } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, RootStackParamList } from '@models';
import {
  NavigationProp,
  RouteProp,
  StackActions,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { GiftCardApi, OrderApi } from '@services/api';
import {
  PaymentSheetError,
  PlatformPay,
  StripeProvider,
  confirmPlatformPayPayment,
  usePlatformPay,
  useStripe,
} from '@stripe/stripe-react-native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, useController, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Feather';
import { useEffectOnce, usePrevious } from 'react-use';
import { AuthModal } from './auth-modal';
import { MerchantDetail } from './card-detail';
import { CheckoutButton } from './checkout-button';
import { OrderForm, validation } from './order-form';
import axios from 'axios';
import { PriceMenuModal } from './price-menu';
import { DeliveryOrderForm, validationDelivery } from './Delivey-order-form';
import { DeliveryCheckoutButton } from './Delivery-checkout';

const AmountItem: React.FC<{
  card: Card;
  selected?: boolean;
  currency_type?: string;
  onSelect(card: Card): void;
}> = ({ card, onSelect, selected, currency_type }) => {
  const [active, setActive] = useState(false);
  return (
    <Pressable
      className={`relative mx-1  whitespace-nowrap flex-col cursor-pointer items-center text-sm px-3`}
      onPress={() => onSelect(card)}
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        {currency_type == 'USA' ? (
          <Text
            // className={`text-gray-600 font-target-bold text-2xl text-center`}
            style={{
              // fontFamily: 'Nasir Udin - MondiaThin',
              textAlign: 'center',
              color: active || selected ? 'rgb(37 99 235)' : '#6e6e6e',
              fontWeight: '600',
              fontSize: 30,
            }}>
            {card?.amount?.amount_usd || 0} USD
          </Text>
        ) : (
          <Text
            // className={`text-gray-500 font-target-bold text-2xl text-center ${
            //   (active || selected) && 'text-blue-600'
            // }`}
            style={{
              // fontFamily: 'Nasir Udin - MondiaThin',
              textAlign: 'center',
              color: active || selected ? 'rgb(37 99 235)' : '#6e6e6e',
              fontWeight: '600',
              fontSize: 30,
            }}>
            {parseFloat((card?.amount?.amount || 0).toString()).toFixed()} Birr
          </Text>
        )}
      </View>

      {/* <Text
        className={`text-gray-500 font-target-medium ${
          (active || selected) && 'text-blue-600'
        }`}>
        {parseFloat((card?.amount?.amount || 0).toString()).toFixed()} Birr
      </Text> */}
    </Pressable>
  );
};

interface OfflineProps {
  MODE: String;
}

export const OrderPage: FC<OfflineProps> = ({ MODE }) => {
  const [paymentName, setPaymentName] = useState<string | undefined>('');
  const { authenticated, verified } = useAuth();
  const router = useRoute<RouteProp<RootStackParamList, 'ORDER'>>();
  let ID;
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitSuccessful, isSubmitted, isSubmitting },
  } = useForm<any>({
    resolver: yupResolver(validation),
    defaultValues: {
      categoryId: router.params?.categoryId || 0,
      payment_method: paymentName,
      delivery_order: 0,
    },
    // values: { payment_method: paymentName },
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
  const [purchaseOrder, state] = OrderApi.useOrderMutation();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const prevAuthenticated = usePrevious(authenticated);
  const [paymentSelected, setPaymentSelected] = useState(false);
  const [paymentBirrSelected, setPaymentBirrSelected] = useState(false);
  const [paymentStripeSelected, setPaymentStripeSelected] = useState(false);
  const [slider1ActiveSlide, setSlider1ActiveSlide] = useState<number>(0);
  const [uuid, setUuid] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');

  // Create a new array with the "All" category added

  const { initPaymentSheet, presentPaymentSheet, handleURLCallback } =
    useStripe();

  const { isPlatformPaySupported } = usePlatformPay();
  const { _token } = useAuth();

  const slider1Ref = useRef<Carousel<any>>(null);

  const merchant = React.useMemo(() => {
    if (!data?.data) {
      return params;
    } else {
      return data?.data;
    }
  }, [data?.data, params, cardSelected, uuid]);

  useEffect(() => {
    console.log('state', state);
    if (state.isSuccess && state.data?.data) {
      toast.success(state.data?.message || '');
      console.log('uuid ***********', state.data.data);
      if (state.data.data?.paymentUrl) {
        if (paymentName == 'stripe') {
          setUuid(state.data.data?.paymentUrl);
        } else {
          navigation.dispatch(
            StackActions.replace('PAYMENT', {
              url: state.data.data?.paymentUrl,
            }),
          );
        }
      }
    }
  }, [state.data?.data, paymentName]);

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          // This was a Stripe URL - you can return or add extra handling here as you see fit
        } else {
          // This was NOT a Stripe URL – handle as you normally would
        }
      }
    },
    [handleURLCallback],
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };
    getUrlAsync();
    const deepLinkListener = Linking.addEventListener(
      'url',
      (event: { url: string }) => {
        handleDeepLink(event.url);
      },
    );
    return () => deepLinkListener.remove();
  }, [handleDeepLink]);

  const initializePaymentSheet = async (SendUUID: string) => {
    console.log('initializePaymentSheet UUID', SendUUID);
    const { paymentIntent, ephemeralKey, customer, PaymentId } =
      await fetchPaymentSheetParams(SendUUID);
    console.log('paymentIntent:>', paymentIntent, ephemeralKey, customer);
    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: false,
      merchantDisplayName: merchant?.name,
      applePay: {
        merchantCountryCode: 'US',
        // cartItems: [
        //         {
        //           label: 'Example item name',
        //           amount: '14.00',
        //           paymentType: PlatformPay.PaymentType.Immediate,
        //         },
        //         {
        //           label: 'Total',
        //           amount: '12.75',
        //           paymentType: PlatformPay.PaymentType.Immediate,
        //         },
        //       ],
        requiredShippingAddressFields: [PlatformPay.ContactField.PostalAddress],
        requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
      },
      style: 'automatic',
      googlePay: {
        merchantCountryCode: 'US',
        testEnv: true,
      },
      returnURL: 'stripe-example://stripe-redirect',
      allowsDelayedPaymentMethods: true,
      primaryButtonLabel: 'purchase!',
      removeSavedPaymentMethodMessage: 'remove this payment method?',
    });
    //   console.log('res -->', res);
    //   openPaymentSheet(PaymentId);
    // })
    // .catch(err => {
    //   console.log('err', err);
    // });
    console.log('error ************', error);
    if (!error) {
      openPaymentSheet(PaymentId);
    } else if (error.code === PaymentSheetError.Failed) {
      console.log(
        `PaymentSheet init failed with error code: ${error.code}`,
        error.message,
      );
    } else if (error.code === PaymentSheetError.Canceled) {
      console.log(
        `PaymentSheet init was canceled with code: ${error.code}`,
        error.message,
      );
    }
  };

  const fetchPaymentSheetParams = useCallback(
    async (SendID: string) => {
      const currAmount = cardSelected?.amount?.amount_usd;
      const amt = parseFloat((currAmount || 0)?.toString());
      const feeamt = cardSelected?.amount?.commission_usd;
      // console.log('stripe feeamt', feeamt);
      const fees = (parseFloat(feeamt?.toString()) / 100) * amt;
      const total = amt + fees; // Use original amount for non-delivery items
      const totalInteger = Math.round(total * 100);
      try {
        setPaymentId('');
        const formdata = new FormData();
        formdata.append('amount', totalInteger.toString());
        formdata.append('uuid', SendID);

        console.log('fetchPaymentSheetParams Formdata ****', formdata);
        console.log('Token  ****', _token);
        // Convert amount to string before appending
        const myHeaders = new Headers();
        myHeaders.append(
          'X-Secret-Key',
          '7q3koDuZzmOiILgPyPpAs07ZdB61n8QuNyTFpFOqLQ',
        );
        myHeaders.append('Authorization', `Bearer ${_token}`);

        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow',
        };

        const response = await fetch(
          `${Config.BASE_URL}/public/api/order/payment-sheet`,
          requestOptions,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} ${response}`);
        }

        const result = await response.json();
        console.log('Fetch Payment Sheet Params Result *****', result);
        const paymentIntent = result?.data?.paymentIntent;
        const ephemeralKey = result?.data?.ephemeralKey;
        const customer = result?.data?.customer;
        const PaymentId = result?.data?.payment_id;
        console.log('PaymentId:', PaymentId);
        setPaymentId(PaymentId);

        return {
          paymentIntent,
          ephemeralKey,
          customer,
          PaymentId,
        };
      } catch (error) {
        console.error('Error fetching payment sheet params:', error);
        throw error;
      }
    },
    [cardSelected, _token],
  );

  // const fetchPaymentSheetParams = async (SendID: string) => {
  // console.log('itemName', itemName);
  // console.log('dataMerchant', dataMerchant);
  // console.log('dataMerchant?.amount', dataMerchant?.amount);
  // console.log(
  //   'dataMerchant?.amount?.amount_usd',
  //   dataMerchant?.amount?.amount_usd,
  // );
  // console.log('*******************************************************');
  // console.log('cardSelected', cardSelected);
  // console.log('cardSelected?.amount', cardSelected?.amount);
  // console.log(
  //   'cardSelected?.amount?.amount_usd',
  //   cardSelected?.amount?.amount_usd,
  // );
  // console.log('*******************************************************');

  // console.log(`Bearer ${_token}`);
  // console.log('fetchPaymentSheetParams UUID', SendID);
  // const currAmount =
  //   itemName == 'Delivery'
  //     ? dataMerchant?.amount?.amount_usd
  //     : cardSelected?.amount?.amount_usd;
  // console.log('stripe currAmount', currAmount);
  // const amt = parseFloat((currAmount || 0)?.toString());
  // console.log(amt);
  // const feeamt =
  //   itemName == 'Delivery'
  //     ? dataMerchant?.amount?.commission_usd
  //     : cardSelected?.amount?.commission_usd;
  // // console.log('stripe feeamt', feeamt);
  // const fees = (parseFloat(feeamt?.toString()) / 100) * amt;
  // console.log(fees);
  // const total =
  //   itemName === 'Delivery'
  //     ? ((amt + fees) * quantity[selectedItemId] || 1).toFixed(2) // Calculate total amount for delivery item
  //     : amt + fees; // Use original amount for non-delivery items
  // // console.log('stripe total', total);
  // const totalInteger = Math.round(total * 100);
  // // console.log('stripe totalInteger', totalInteger);
  // // try {
  // //   setPaymentId('');
  // //   const formdata = new FormData();
  // //   formdata.append('amount', totalInteger.toString());
  // //   formdata.append('uuid', SendID);

  // //   console.log('fetchPaymentSheetParams Formdata ****', formdata);
  // //   // Convert amount to string before appending
  // //   const myHeaders = new Headers();
  // //   myHeaders.append(
  // //     'X-Secret-Key',
  // //     '7q3koDuZzmOiILgPyPpAs07ZdB61n8QuNyTFpFOqLQ',
  // //   );
  // //   myHeaders.append('Authorization', `Bearer ${_token}`);

  // //   const requestOptions = {
  // //     method: 'POST',
  // //     headers: myHeaders,
  // //     body: formdata,
  // //     redirect: 'follow',
  // //   };

  // //   const response = await fetch(
  // //     `${Config.BASE_URL}/public/api/order/payment-sheet`,
  // //     requestOptions,
  // //   );

  // //   if (!response.ok) {
  // //     throw new Error(`HTTP error! status: ${response.status} ${response}`);
  // //   }

  // //   const result = await response.json();
  // //   console.log('Fetch Payment Sheet Params Result *****', result);
  // //   const paymentIntent = result?.data?.paymentIntent;
  // //   const ephemeralKey = result?.data?.ephemeralKey;
  // //   const customer = result?.data?.customer;
  // //   const PaymentId = result?.data?.payment_id;
  // //   console.log('PaymentId:', PaymentId);
  // //   setPaymentId(PaymentId);

  // //   return {
  // //     paymentIntent,
  // //     ephemeralKey,
  // //     customer,
  // //     PaymentId,
  // //   };
  // // } catch (error) {
  // //   console.error('Error fetching payment sheet params:', error);
  // //   throw error;
  // // }
  // };

  const Paymentsuccess = async (SendPaymentId: string) => {
    try {
      if (state.data?.data?.paymentUrl || uuid || SendPaymentId) {
        const formdata = new FormData();
        // formdata.append('uuid', uuid);
        formdata.append('payment_id', SendPaymentId);
        formdata.append('status', 'succeeded');

        // Convert amount to string before appending

        console.log('fromdata *******', formdata);
        const myHeaders = new Headers();
        myHeaders.append(
          'X-Secret-Key',
          '7q3koDuZzmOiILgPyPpAs07ZdB61n8QuNyTFpFOqLQ',
        );
        myHeaders.append('Authorization', `Bearer ${_token}`);

        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow',
        };

        const response = await fetch(
          `${Config.BASE_URL}/public/api/order/stripe-payment-status`,
          requestOptions,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Payment Success Response:', result);
        navigation.dispatch(StackActions.popToTop());
      } else {
        console.log('Error In Payment success API');
      }
    } catch (error) {
      console.error('Error fetching payment sheet params:', error);
      throw error;
    }
  };

  const openPaymentSheet = async (NewPaymentId: string) => {
    const { error } = await presentPaymentSheet();

    if (!error) {
      Alert.alert('Success', 'The payment was confirmed successfully');
      Paymentsuccess(NewPaymentId);
    } else {
      switch (error.code) {
        case PaymentSheetError.Failed:
          console.log(
            `PaymentSheet present failed with error code: ${error.code}`,
            error.message,
          );

          break;
        case PaymentSheetError.Canceled:
          console.log(
            `PaymentSheet present was canceled with code: ${error.code}`,
            error.message,
          );
          break;
        case PaymentSheetError.Timeout:
          Alert.alert(
            `PaymentSheet present timed out: ${error.code}`,
            error.message,
          );
          break;
      }
    }
  };

  useEffect(() => {
    (async function () {
      if (!(await isPlatformPaySupported({ googlePay: { testEnv: true } }))) {
        console.log('Google Pay is not supported.');
        return;
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (!(await isPlatformPaySupported())) {
        console.log('Apple Pay is not supported.');
        return;
      }
    })();
  }, []);

  const checkout = useCallback(
    async (force = false) => {
      if (isSubmitSuccessful || force) {
        if (authenticated && verified) {
          if (paymentName == 'paypal') {
            purchaseOrder(getValues());
          } else if (paymentName == 'telebirr') {
            await purchaseOrder(getValues())
              .then(res => {
                console.log('Response You Get For Placeorder:', res?.data);
                // navigation.navigate('TELEBIRR', {
                //   card: cardSelected,
                //   uuid: res?.data?.data?.paymentUrl,
                //   type: 'Card',
                // });
                // initializePaymentSheet(res?.data?.data?.paymentUrl);
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            await purchaseOrder(getValues())
              .then(res => {
                console.log('Respinse You Get For Placeorder:', res?.data);
                initializePaymentSheet(res?.data?.data?.paymentUrl);
              })
              .catch(err => {
                Alert.alert('Stripe error', err);
                console.log(err);
              });
          }
        } else if (authenticated && !verified) {
          setAuthModalVisible(true);
        } else {
          setAuthModalVisible(true);
        }
      }
    },
    [
      authenticated,
      isSubmitSuccessful,
      verified,
      isSubmitted,
      isSubmitting,
      paymentName,
      cardSelected,
      uuid,
      paymentId,
    ],
  );

  const onSubmit = (value: FieldValues) => {
    console.log('Form Data:', value);
    checkout(true);
  };

  const Focus = useIsFocused();

  useEffect(() => {
    if (Focus) refetch();
  }, [Focus]);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (authenticated && !prevAuthenticated && isSubmitSuccessful) {
      setAuthModalVisible(false);
      checkout();
    }
  }, [authenticated, prevAuthenticated]);

  const onClick = async (uuId: any) => {
    try {
      const currAmount = cardSelected?.amount?.amount;

      console.log('curramount ********', currAmount);
      const amt = parseFloat((currAmount || 0)?.toString());
      const feeamt = cardSelected?.amount?.fee;
      const fees = (parseFloat(feeamt?.toString()) / 100) * amt;
      console.log('fees ********', fees);
      const total = amt + fees;
      console.log('total ********', total);
      var body = {
        amount: total.toString(),
        uuid: uuId,
      };
      console.log('body *************', body);
      const response = await axios.post(
        'https://fetangift.com/api/request_payload',
        body,
        {
          headers: {
            Accept: 'application/json',
            'X-Secret-Key': '7q3koDuZzmOiILgPyPpAs07ZdB61n8QuNyTFpFOqLQ',
          },
        },
      );

      const { data } = response;
      console.log('#########res data===>', data.data);
      if (data.status === 200) {
        getpaymentUrl(data.data);
        console.log('res==========>1', data);
      }
    } catch (error) {
      console.log('e===========>', error);
      // handleError(error);
    }
  };

  const getpaymentUrl = async (payload: any) => {
    console.log('>>>>>payload>>>>>val>>>>>>', payload);
    try {
      const response = await axios.post(
        'https://app.ethiomobilemoney.et:2121/ammapi/payment/service-openup/toTradeWebPay',
        payload,
        {
          // timeout: 10000,
          headers: {
            'content-type': 'application/json',
          },
        },
      );

      const { data } = response;
      console.log('res==========>12', response);
      console.log('res=========$$$$$$$$$$=>', data);
      if (data.code === 200) {
        navigation.dispatch(
          StackActions.replace('PAYMENT', {
            url: data.data?.toPayUrl,
          }),
        );

        console.log('res==========>', data);
      }
    } catch (e) {
      console.log('ez===========>', e);
      // handleError(e);
    }
  };

  return (
    <StripeProvider
      publishableKey={Config.Client_Live_publishableKey}
      merchantIdentifier={Config.merchantIdentifier}>
      <Page
        onRefresh={refetch}
        pageLoader={state.isLoading || isLoading}
        contentBottom={
          <CheckoutButton
            card={cardSelected}
            onSubmit={handleSubmit(onSubmit)}
            fee={data?.fee}
            Mode={MODE}
            currency_type={merchant?.currency_type}
            withUSD
            paymentName={paymentName}
          />
        }>
        <View className={'container bg-white bottom-0 pb-[50]'}>
          <Text style={styles.selectWayText}>Select your amount</Text>

          {errors.cardId && (
            <View className="bg-red-100 mb-2 border border-red-400 px-4 py-3 rounded relative mt-2">
              <Text className="text-red-700">
                {errors.cardId?.message?.toString() || ''}
              </Text>
            </View>
          )}
          <View className="flex-row items-center justify-center mt-3">
            {slider1ActiveSlide !== 0 && merchant.cards?.length > 1 ? (
              <TouchableOpacity
                onPress={() => slider1Ref.current?.snapToPrev()}>
                <Image
                  style={styles.leftArrow}
                  source={require('../../../assets/images/left-arrow.png')}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.spaceView}></View>
            )}
            <View style={styles.curouselView}>
              <Carousel
                ref={slider1Ref}
                data={merchant.cards}
                firstItem={1}
                initialNumToRender={10}
                activeSlideAlignment={'start'}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setCard(item);
                      amountField.field.onChange(item.id);
                    }}
                    activeOpacity={0.7}>
                    <ImageBackground
                      source={Images.AMOUNT_BG}
                      style={[
                        styles.backgroundImage,
                        {
                          borderColor:
                            item?.id == cardSelected?.id ? '#d4d4d4' : 'white',
                        },
                      ]}
                      resizeMode="cover">
                      <View style={styles.amountView}>
                        <AmountItem
                          currency_type={merchant?.currency_type}
                          key={`amount-${item.id}`}
                          card={item}
                          onSelect={selectedCard => {
                            setCard(selectedCard);
                            amountField.field.onChange(selectedCard.id);
                          }}
                          selected={cardSelected?.id === item.id}
                        />
                      </View>
                      <View style={styles.merchantNameView}>
                        <Text style={styles.merchantText}>{merchant.name}</Text>
                      </View>
                      <View>
                        <Text style={styles.locationText}>
                          {`${merchant.city.name}`}
                          {merchant.town ? `, ${merchant.town.name}` : ''}
                        </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
                sliderWidth={335}
                itemWidth={335}
                enableMomentum={false}
                decelerationRate={0.25}
                loop={false}
                onSnapToItem={index => setSlider1ActiveSlide(index)}
                inactiveSlideScale={1} // Set the scale of inactive slides to 1 (no scaling)
                inactiveSlideOpacity={1} // Set the opacity of inactive slides to 1 (fully visible)
              />
            </View>
            {slider1ActiveSlide + 1 !== merchant.cards?.length ||
            (0 <= 0 && merchant.cards?.length > 1) ? (
              <TouchableOpacity
                onPress={() => slider1Ref.current?.snapToNext()}>
                <Image
                  style={styles.rightArrow}
                  source={require('../../../assets/images/right-arrow.png')}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.spaceLeftView}></View>
            )}
          </View>
          <TouchableOpacity
            style={styles.priceMenuView}
            onPress={() => {
              Linking.openURL(data?.slug);
            }}>
            <View style={styles.priceSecondView}>
              <Text style={styles.priceText}>Price & menu</Text>
              <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                <Image
                  source={Images.RIGHT_ARROW}
                  style={styles.rightImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </TouchableOpacity>
          <View className="h-[1px] bg-gray-200 mt-2" />
          <OrderForm control={control} />
          <View className="mb-[60px] px-[20px]">
            <View>
              {((merchant && merchant.cards?.length) || 0) <= 0 && (
                <View className="bg-red-100 border border-red-400 px-4 py-3 rounded relative">
                  <Text className="text-red-700">
                    <Text className="font-target-bold">Oops! </Text>
                    This merchant doesn't have any amount options.
                  </Text>
                </View>
              )}
              <View>
                <Text className="font-target-bold text-dark text-lg mb-3">
                  Payment Method
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  // refetch();
                  setValue('payment_method', 'stripe');
                  setPaymentName('stripe');
                  setPaymentBirrSelected(false);
                  setPaymentSelected(false);
                  setPaymentStripeSelected(true);
                }}
                style={{
                  borderWidth: 2,
                  padding: 12,
                  borderRadius: 10,
                  borderColor: paymentStripeSelected ? '#dd2621' : '#dbdde2',
                  backgroundColor: paymentStripeSelected
                    ? '#fdf1f2'
                    : '#f9fbfc',
                }}>
                <View style={{ marginBottom: 4 }}>
                  {paymentStripeSelected && (
                    <View>
                      <Image
                        source={Images.CHECK}
                        resizeMode="contain"
                        style={styles.checkImage}
                      />
                    </View>
                  )}
                </View>
                <View style={styles.stripeMainView}>
                  <Image
                    source={Images.MAIN_STRIPE}
                    resizeMode="contain"
                    style={styles.stripeImage}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // refetch();
                  setValue('payment_method', 'telebirr');
                  setPaymentName('telebirr');
                  setPaymentSelected(false);
                  setPaymentStripeSelected(false);
                  setPaymentBirrSelected(true);
                }}
                style={{
                  borderWidth: 2,
                  padding: 12,
                  borderRadius: 10,
                  borderColor: paymentBirrSelected ? '#dd2621' : '#dbdde2',
                  backgroundColor: paymentBirrSelected ? '#fdf1f2' : '#f9fbfc',
                  top: 10,
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.teleBirrView}>
                    <Image
                      source={Images.TELEBIRRNEW}
                      style={{ height: 45, width: 50 }}
                      resizeMode="contain"
                    />
                  </View>
                  {paymentBirrSelected && (
                    <View>
                      <Image
                        source={Images.CHECK}
                        resizeMode="contain"
                        style={styles.BirrCheck}
                      />
                    </View>
                  )}
                  <View style={{ marginHorizontal: 10 }}>
                    <Text className="font-target-bold text-dark text-base text-black">
                      Pay with telebirr
                    </Text>
                    <Text className="font-normal text-black">
                      {' '}
                      {cardSelected?.amount?.amount ?? '-'} ETB
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // refetch();
                  setValue('payment_method', 'paypal');
                  setPaymentName('paypal');
                  setPaymentBirrSelected(false);
                  setPaymentStripeSelected(false);
                  setPaymentSelected(true);
                }}
                style={{
                  borderWidth: 2,
                  padding: 12,
                  borderRadius: 10,
                  borderColor: paymentSelected ? '#dd2621' : '#dbdde2',
                  backgroundColor: paymentSelected ? '#fdf1f2' : '#f9fbfc',
                  top: 20,
                  marginBottom: 70,
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.paypalView}>
                    <Image
                      source={Images.PAYPALLOGO}
                      style={{ height: 22, width: 22 }}
                      resizeMode="contain"
                    />
                  </View>
                  {paymentSelected && (
                    <View>
                      <Image
                        source={Images.CHECK}
                        resizeMode="contain"
                        style={styles.BirrCheck}
                      />
                    </View>
                  )}
                  <View style={{ marginHorizontal: 10 }}>
                    <Text className="font-target-bold text-dark text-base text-black">
                      Pay with Paypal
                    </Text>
                    <Text className="font-normal text-black">
                      {cardSelected?.amount?.amount_usd ?? '-'} USD
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {merchant?.currency_type == 'Eure' && (
                <View className="flex flex-row justify-center">
                  <Pressable
                    className="flex-row bg-gray-100 active:bg-gray-200 active:ring-4 active:outline-none active:ring-gray-100  rounded-lg px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
                    onPress={() => {
                      navigation.dispatch(
                        StackActions.replace('OFFLINE_ORDER', router.params),
                      );
                    }}>
                    <Icon
                      name="git-pull-request"
                      size={14}
                      style={{ marginRight: 10 }}
                    />
                    <Text className="text-gray-900 font-medium text-sm">
                      Switch to Manual
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
        <AuthModal
          isVisible={authModalVisible}
          onModalHide={setAuthModalVisible}
        />
      </Page>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  selectWayText: {
    textAlign: 'center',
    fontSize: 25,
    color: '#7F7F7F',
    fontFamily: 'Righteous-Regular',
    fontWeight: '600',
  },
  sendView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 29,
    marginTop: 10,
  },
  sendGiftText: {
    fontFamily: 'Righteous-Regular',
    fontSize: 17,
    color: '#878787',
    alignSelf: 'center',
  },
  orText: {
    color: '#2a98d3',
    fontSize: 25,
    fontWeight: '400',
  },
  ItemDeliveryText: {
    fontFamily: 'Righteous-Regular',
    fontSize: 17,
    color: '#878787',
  },
  giftCardView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    overflow: 'hidden',
  },
  leftArrow: {
    width: 20,
    height: 20,
    marginRight: 5,
    tintColor: 'grey',
    // marginLeft: 5,
  },
  spaceView: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  spaceLeftView: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  curouselView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: Platform.OS == 'android' ? '100%' : '99%',
    height: 180,
    borderWidth: 0.7,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  amountView: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  merchantNameView: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  merchantText: {
    fontFamily: 'new_renaissance',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
    color: '#333333',
  },
  locationText: {
    color: '#868686',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 5,
  },
  rightArrow: {
    width: 20,
    height: 20,
    tintColor: 'grey',
    marginLeft: 5,
  },
  deliveryBackground: {
    width: Platform.OS == 'android' ? 155 : 170,
    height: 100,
    borderWidth: 0.7,
    marginRight: 15,
    overflow: 'hidden',
  },
  priceMenuView: {
    backgroundColor: '#0978c1',
    alignSelf: 'center',
    // alignItems:'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  priceSecondView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    marginHorizontal: 7,
  },
  priceText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  rightImage: {
    width: 13,
    height: 13,
    marginLeft: 10,
    alignSelf: 'center',
    top: 2,
    tintColor: 'white',
  },
  checkImage: {
    height: 20,
    width: 20,
    marginTop: -10,
  },
  stripeMainView: {
    width: '100%',
    overflow: 'hidden',
  },
  stripeImage: {
    height: 40,
    width: '80%',
    marginLeft: 2,
  },
  teleBirrView: {
    backgroundColor: '#e6e7ea',
    // padding: 10,
    width: 65,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BirrCheck: {
    height: 20,
    width: 20,
    marginLeft: -15,
    marginTop: -7,
  },
  paypalView: {
    backgroundColor: '#e6e7ea',
    padding: 10,
    width: 65,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
