import { toast } from '@backpackapp-io/react-native-toast';
import { Config, Images } from '@common/constants';
import { useAuth } from '@common/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { RootStackParamList } from '@models';
import { DeliveryCheckoutButton } from '@pages/order/Delivery-checkout';
import {
  DeliveryOrderForm,
  validationDelivery,
} from '@pages/order/Delivey-order-form';
import { AuthModal } from '@pages/order/auth-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationProp,
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { OrderApi } from '@services/api';
import {
  PaymentSheetError,
  PlatformPay,
  StripeProvider,
  initPaymentSheet,
  presentPaymentSheet,
  usePlatformPay,
} from '@stripe/stripe-react-native';
import axios from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePrevious } from 'react-use';

export const CartItemPage: FC = () => {
  const router = useRoute<RouteProp<RootStackParamList, 'CARTITEM'>>();
  const params = router.params;
  const { authenticated, verified } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [paymentSelected, setPaymentSelected] = useState(false);
  const [paymentBirrSelected, setPaymentBirrSelected] = useState(false);
  const [paymentStripeSelected, setPaymentStripeSelected] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [count, setCount] = useState(0);
  const [purchaseOrder, state] = OrderApi.useOrderMutation();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const prevAuthenticated = usePrevious(authenticated);
  const [uuid, setUuid] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const { isPlatformPaySupported } = usePlatformPay();
  const { _token } = useAuth();

  const [paymentName, setPaymentName] = useState<string | undefined>(
    'telebirr',
  );
  // Calculate total amount
  const [totalAmountData, setTotalAmountData] = useState<string>();
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [itemQuantities, setItemQuantities] = useState<{
    [key: number]: number;
  }>({});

  useEffect(() => {
    if (state.isSuccess && state.data?.data) {
      toast.success(state.data?.message || '');
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

  // Function to handle incrementing item quantity
  const incrementQuantity = (itemId: number) => {
    setItemQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 1) + 1,
    }));
  };

  // Function to handle decrementing item quantity
  const decrementQuantity = (itemId: number) => {
    setItemQuantities(prevQuantities => ({
      ...prevQuantities,
      [itemId]: Math.max((prevQuantities[itemId] || 1) - 1, 1),
    }));
  };

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitSuccessful, isSubmitted, isSubmitting },
  } = useForm<any>({
    resolver: yupResolver(validationDelivery),
    defaultValues: {
      categoryId: router.params?.categoryId || 0,
      payment_method: paymentName,
      delivery_order: 1,
    },
  });

  const onSubmit = (value: FieldValues) => {
    checkout(true);
  };

  const checkout = useCallback(
    async (force = false) => {
      if (isSubmitSuccessful || force) {
        if (authenticated && verified) {
          if (paymentName == 'paypal') {
            purchaseOrder(getValues());
          } else if (paymentName == 'telebirr') {
            await purchaseOrder(getValues())
              .then(res => {
                if (res?.data?.data?.paymentUrl) {
                  onClick(res?.data?.data?.paymentUrl);
                } else {
                  Alert.alert('Error', 'Payment URL not found');
                }
                // navigation.navigate('TELEBIRR', {
                //   card: totalAmountData,
                //   uuid: res?.data?.data?.paymentUrl,
                //   type: 'Item',
                // });
                // initializePaymentSheet(res?.data?.data?.paymentUrl);
              })
              .catch(err => {});
          } else {
            await purchaseOrder(getValues())
              .then(res => {
                initializePaymentSheet(res?.data?.data?.paymentUrl);
              })
              .catch(err => {
                // Alert.alert('stripe', String(err));
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
      cartItems,
      uuid,
      paymentId,
      totalAmountData,
    ],
  );

  useEffect(() => {
    if (authenticated && !prevAuthenticated && isSubmitSuccessful) {
      setAuthModalVisible(false);
      checkout();
    }
  }, [authenticated, prevAuthenticated]);

  useEffect(() => {
    setCount(cartItems?.length || 0);
    setValue('merchantid', params?.merchant?.id);
  }, [
    count,
    uuid,
    _token,
    paymentName,
    cartItems[0]?.id,
    params?.merchant?.id,
  ]);

  const initializePaymentSheet = async (SendUUID: string) => {
    const { paymentIntent, ephemeralKey, customer, PaymentId } =
      await fetchPaymentSheetParams(SendUUID);
    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: false,
      merchantDisplayName: router?.params?.merchant?.name,
      applePay: {
        merchantCountryCode: 'US',
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
    if (!error) {
      openPaymentSheet(PaymentId);
    } else if (error.code === PaymentSheetError.Failed) {
      // Alert.alert(
      //   'PaymentSheet init failed with error code',
      //   String(error.message),
      // );
    } else if (error.code === PaymentSheetError.Canceled) {
      // Alert.alert(
      //   'PaymentSheet init was canceled with code:',
      //   String(error.message),
      // );
    }
  };

  const fetchPaymentSheetParams = useCallback(
    async (SendID: string) => {
      // const currAmount = cartItems[0]?.amount?.amount_usd;
      // const amt = parseFloat((currAmount || 0)?.toString());
      // const feeamt = cartItems[0]?.amount?.commission_usd;
      // // console.log('stripe feeamt', feeamt);
      // const fees = (parseFloat(feeamt?.toString()) / 100) * amt;
      // const total = amt + fees; // Use original amount for non-delivery items
      const totalInteger = Math.round(totalAmountData * 100);
      try {
        setPaymentId('');
        const formdata = new FormData();
        formdata.append('amount', totalInteger);
        formdata.append('uuid', SendID);

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
          throw new Error(
            `HTTP error! status: ${response.status} ${response?.data}`,
          );
        }

        const result = await response.json();
        const paymentIntent = result?.data?.paymentIntent;
        const ephemeralKey = result?.data?.ephemeralKey;
        const customer = result?.data?.customer;
        const PaymentId = result?.data?.payment_id;
        setPaymentId(PaymentId);

        return {
          paymentIntent,
          ephemeralKey,
          customer,
          PaymentId,
        };
      } catch (error) {
        console.error('Error fetching payment sheet params:', error);
        // Alert.alert('Payment sheet', String(error));
        throw error;
      }
    },
    [cartItems, _token, totalAmountData],
  );

  const Paymentsuccess = async (SendPaymentId: string) => {
    try {
      if (state.data?.data?.paymentUrl || uuid || SendPaymentId) {
        const formdata = new FormData();
        // formdata.append('uuid', uuid);
        formdata.append('payment_id', SendPaymentId);
        formdata.append('status', 'succeeded');

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
          `${Config.BASE_URL}/public/api/order/stripe-payment-status`,
          requestOptions,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // navigation.navigate("HOME_INDEX")
        await AsyncStorage.removeItem('cartItems');
        setCartItems([]);
        navigation.dispatch(StackActions.popToTop());
      } else {
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
          // Alert.alert('PaymentSheet present failed', String(error.message));
          break;
        case PaymentSheetError.Canceled:
          // Alert.alert(
          //   'PaymentSheet present was canceled',
          //   String(error.message),
          // );
          break;
        case PaymentSheetError.Timeout:
          break;
      }
    }
  };

  useEffect(() => {
    (async function () {
      if (!(await isPlatformPaySupported({ googlePay: { testEnv: true } }))) {
        Alert.alert('Google Pay is not supported.');
        return;
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (!(await isPlatformPaySupported())) {
        return;
      }
    })();
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [totalAmountData, paymentName, count, _token]);

  useEffect(() => {
    let totalAmount = 0;
    let totalFeeAmount = 0;
    let quantitiesString = '';
    let itemString = '';

    // Check if payment method is 'teleBirr' and currency type is 'Eure'
    const isTeleBirrAndEure = paymentName === 'telebirr';

    // Extract the fee amount from the first item
    const firstItemFee =
      paymentName == 'telebirr'
        ? parseFloat(params?.deliveryFee)
        : parseFloat(params?.DeliveryFee_usd);

    // Loop through all items in the cart
    cartItems?.forEach((item, index) => {
      // Retrieve the price of the item based on currency and payment method
      const itemPrice = isTeleBirrAndEure
        ? parseFloat(item?.amount?.amount || 0)
        : parseFloat(item?.amount?.amount_usd || 0);

      const itemId = item.id;
      const quantity = itemQuantities[itemId] || 1;
      quantitiesString += `${quantity}${
        index === cartItems.length - 1 ? '' : ', '
      }`;
      itemString += `${itemId}${index === cartItems.length - 1 ? '' : ', '}`;

      setValue('quantity', quantitiesString);
      setValue('itemid', itemString);
      // Calculate the total cost for the item (including fees)
      const totalItemCost = itemPrice * quantity;
      totalAmount += totalItemCost;
      // Add the total cost for the item to the overall total amount
    });

    const totalValue: number = totalAmount + firstItemFee;
    // Calculate the total fee amount based on the first item
    setTotalAmountData(totalValue?.toFixed(2));
    setTotalAmount(totalValue);
    setValue('total', Number(totalValue.toFixed(2)));
  }, [
    cartItems,
    paymentName,
    itemQuantities,
    params?.deliveryFee,
    params?.DeliveryFee_usd,
  ]);

  // Function to fetch cart items from AsyncStorage
  const fetchCartItems = async () => {
    try {
      const cartItemsJson = await AsyncStorage.getItem('cartItems');
      if (cartItemsJson !== null) {
        const allCartItems = JSON.parse(cartItemsJson);
        // Filter cart items based on the provided merchantId
        const merchantCartItems = allCartItems.filter(
          item => item.merchantId === params?.merchant?.id,
        );
        // Update count and set cart items for the particular merchant
        setCount(merchantCartItems.length);
        setValue('itemid', merchantCartItems[0]?.id);
        setCartItems(merchantCartItems);
      }
    } catch (error) {
      console.error('Error fetching cart items: ', error);
    }
  };

  // Function to remove an item from the cart
  const removeItem = async (itemId: number) => {
    try {
      // const updatedCartItems = cartItems.filter(item => item.id !== itemId);
      const updatedCartItems = cartItems.filter(item => {
        return item.id !== itemId && item.merchant_id === params?.merchant?.id;
      });
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      fetchCartItems();
      setCount(updatedCartItems?.length);
    } catch (error) {
      console.error('Error removing item from cart: ', error);
    }
  };

  const onClick = async (uuId: any) => {
    try {
      // const currAmount = cartItems[0]?.amount?.amount;

      // const amt = parseFloat((currAmount || 0)?.toString());
      // const feeamt = cartItems[0]?.amount?.fee;
      // const fees = (parseFloat(feeamt?.toString()) / 100) * amt;
      // console.log('fees ********', fees);
      // const total = amt + fees;

      var body = {
        amount: totalAmountData?.toString(),
        uuid: uuId,
      };
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
      if (data.status === 200) {
        // getpaymentUrl(data.data);
        navigation.dispatch(
          StackActions.replace('PAYMENT', {
            url: data.data,
          }),
        );
      }
    } catch (error) {
      // handleError(error);
    }
  };

  const getpaymentUrl = async (payload: any) => {
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
      if (data.code === 200) {
        navigation.dispatch(
          StackActions.replace('PAYMENT', {
            url: data.data?.toPayUrl,
          }),
        );
      }
    } catch (e) {
      console.log('ez===========>', e);
      // handleError(e);
    }
  };

  const calculateFeePercentage = () => {
    const FeePrice =
      paymentName === 'telebirr'
        ? parseFloat(params?.deliveryFee)
        : parseFloat(params?.DeliveryFee_usd);

    // Ensure FeePrice and totalAmountData are valid numbers
    if (isNaN(FeePrice) || totalAmount === undefined || totalAmount === null) {
      console.error('FeePrice or totalAmountData is not a valid number.');
      return 0; // Or handle the error appropriately
    }

    // Parse totalAmount to a number
    const totalAmountNumber = parseFloat(String(totalAmountData));

    // Ensure totalAmountNumber is a valid number
    if (isNaN(totalAmountNumber)) {
      console.error('totalAmount is not a valid number.');
      return 0; // Or handle the error appropriately
    }

    // Calculate FeePercentage
    const FeePercentage = (FeePrice * 100) / totalAmountNumber;
    return FeePercentage;
  };

  return (
    <StripeProvider
      publishableKey={Config.Client_Live_publishableKey}
      merchantIdentifier={Config.merchantIdentifier}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.headerView}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.goBack()}>
              <Feather
                name="arrow-left"
                size={25}
                color={'#000000'}
                style={styles.leftArrow}
              />
            </TouchableOpacity>
            <View style={{ width: '75%' }}>
              <Text style={styles.headerText}>{params.merchant.name}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons name="cart-sharp" size={26} color={'#000000'} />
              <Text style={styles.countText}>{count}</Text>
            </View>
          </View>
          <ScrollView>
            <DeliveryOrderForm control={control} />
            <View style={{ borderTopWidth: 0.7, borderColor: '#7f7f7f' }} />

            {cartItems?.length > 0 && (
              <ScrollView style={{ marginHorizontal: 15 }}>
                <FlatList
                  data={cartItems}
                  renderItem={({ item }) => {
                    const itemId = item.id;
                    const quantity = itemQuantities[itemId] || 1;
                    return (
                      <View
                        style={{ marginHorizontal: 10, marginVertical: 10 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <View>
                            <Image
                              source={{ uri: item?.image }}
                              style={{ height: 70, width: 70 }}
                              resizeMode="cover"
                            />
                          </View>
                          <View
                            style={{
                              flexDirection: 'column',
                              marginLeft: 15,
                              width: '53%',
                            }}>
                            <Text style={styles.descText}>
                              {item?.bizitem?.item_name}
                            </Text>
                            <Text style={styles.descText} numberOfLines={1}>
                              {item?.description}
                            </Text>
                          </View>
                          <View>
                            <Text
                              style={{
                                color: '#000000',
                                fontWeight: '600',
                                fontSize: 15,
                              }}>
                              {params?.merchant?.currency_type == 'Eure'
                                ? 'Birr'
                                : '$'}{' '}
                              <Text style={styles.amountText}>
                                {params?.merchant?.currency_type == 'Eure'
                                  ? item?.amount?.amount
                                  : item?.amount?.amount_usd}
                              </Text>
                            </Text>
                          </View>
                        </View>
                        <View style={styles.removeView}>
                          <Text
                            style={styles.removeText}
                            onPress={() => removeItem(item.id)}>
                            Remove
                          </Text>
                          <View style={styles.decreamentView}>
                            <TouchableOpacity
                              style={{ marginLeft: 10 }}
                              onPress={() => decrementQuantity(item.id)}>
                              <Text style={{ fontSize: 22, color: '#4B96E7' }}>
                                -
                              </Text>
                            </TouchableOpacity>
                            <View>
                              <Text style={styles.quantityText}>
                                {quantity}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={{ marginRight: 10 }}
                              onPress={() => incrementQuantity(item.id)}>
                              <Text style={{ fontSize: 22, color: '#4B96E7' }}>
                                +
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View>
                          <Text
                            style={{
                              alignSelf: 'flex-end',
                              paddingTop: 7,
                              fontWeight: '700',
                            }}>
                            {quantity} item
                          </Text>
                        </View>
                        <View
                          style={{
                            borderTopWidth: 0.4,
                            marginTop: 10,
                            borderColor: '#7F7F7F',
                          }}
                        />
                      </View>
                    );
                  }}
                />
              </ScrollView>
            )}
            <View
              style={{
                marginHorizontal: 20,
                marginVertical: 10,
                marginBottom: 70,
              }}>
              <View style={styles.methodView}>
                <View>
                  <Text className="font-target-bold text-dark text-lg">
                    Payment Method
                  </Text>
                </View>
                <View>
                  <Text style={styles.deliveryFeeText}>
                    Delivery Fee {paymentName == 'telebirr' ? 'Bir' : 'USD'}:{' '}
                    {paymentName == 'telebirr'
                      ? parseFloat(params?.deliveryFee).toFixed(2)
                      : parseFloat(params?.DeliveryFee_usd).toFixed(2)}
                  </Text>
                </View>
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
                style={[
                  styles.stripeTouchable,
                  {
                    borderColor: paymentStripeSelected ? '#dd2621' : '#dbdde2',
                    backgroundColor: paymentStripeSelected
                      ? '#fdf1f2'
                      : '#f9fbfc',
                  },
                ]}>
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
                style={[
                  styles.telebirrTouchable,
                  {
                    borderColor: paymentBirrSelected ? '#dd2621' : '#dbdde2',
                    backgroundColor: paymentBirrSelected
                      ? '#fdf1f2'
                      : '#f9fbfc',
                  },
                ]}>
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
                      {/* {' '} */}
                      {cartItems[0]?.amount?.amount ?? '-'} ETB
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
                style={[
                  styles.paypalTouchable,
                  {
                    borderColor: paymentSelected ? '#dd2621' : '#dbdde2',
                    backgroundColor: paymentSelected ? '#fdf1f2' : '#f9fbfc',
                  },
                ]}>
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
                      {cartItems[0]?.amount?.amount_usd ?? '-'} USD
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View>
            <DeliveryCheckoutButton
              card={cartItems[0]?.amount}
              onSubmit={handleSubmit(onSubmit)}
              fee={params?.cartItem[0]?.amount?.fee}
              Mode={'Online'}
              currency_type={params?.merchant?.currency_type}
              withUSD
              paymentName={paymentName}
              totalAmount={totalAmountData}
              totalValue={totalAmount}
              totalFee={
                calculateFeePercentage()
                // paymentName == 'telebirr'
                //   ? parseFloat(params?.deliveryFee)
                //   : parseFloat(params?.DeliveryFee_usd)
              }
            />
          </View>
        </View>
      </SafeAreaView>
      <AuthModal
        isVisible={authModalVisible}
        onModalHide={setAuthModalVisible}
      />
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  headerView: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftArrow: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
  },
  countText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000000',
    marginTop: -7,
    marginLeft: 4,
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
  paypalTouchable: {
    borderWidth: 2,
    padding: 12,
    borderRadius: 10,
    top: 20,
    marginBottom: 70,
  },
  telebirrTouchable: {
    borderWidth: 2,
    padding: 12,
    borderRadius: 10,
    top: 10,
  },
  stripeTouchable: {
    borderWidth: 2,
    padding: 12,
    borderRadius: 10,
  },
  decreamentView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 40,
    borderWidth: 1,
    width: 120,
    justifyContent: 'space-between',
    borderColor: '#a1a1a1',
  },
  quantityText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
  },
  deliveryFeeText: {
    fontWeight: '600',
    color: '#515151',
  },
  methodView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  removeText: {
    textDecorationLine: 'underline',
    fontWeight: '600',
    color: 'black',
  },
  removeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'space-between',
  },
  amountText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 17,
  },
  descText: {
    color: '#8e8e8e',
    fontWeight: '600',
  },
});
