import { Images } from '@common/constants';
import { MobileInput } from '@components';
import { Header } from '@components/header';
import { FC, useState } from 'react';
import { Control, Controller, FieldValues, useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';
import { Image } from 'react-native';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Platform, StatusBar, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CountryPicker, {
  Country,
  CountryCode,
  CountryModalProvider,
} from 'react-native-country-picker-modal';
import { TextInput } from 'react-native-gesture-handler';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { RootStackParamList } from '@models';
import axios from 'axios';
import { toast } from '@backpackapp-io/react-native-toast';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height, width } = Dimensions.get('window');

export const isIPhone = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV
    ? (width === X_WIDTH && height === X_HEIGHT) ||
      (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    : false;

export const StatusBarHeights = Platform.select({
  ios: isIPhone() ? 44 : 47,
  android: StatusBar.currentHeight,
  default: 0,
});

const MyStatusBarComponent = ({ ...props }) => {
  return (
    <View
      style={{
        height: StatusBarHeights,
        backgroundColor: 'rgb(204, 0, 0)',
        // paddingTop: STATUSBAR_HEIGHT,
      }}>
      <SafeAreaView>
        <StatusBar {...props} />
      </SafeAreaView>
    </View>
  );
};

export const validationDelivery = yup
  .object({
    mobile_number: yup
      .number()
      .typeError('Invalid mobile number format.')
      .required('Invalid mobile number'),
  })
  .required();

export const TelebirrForm: FC = () => {
  const router = useRoute<RouteProp<RootStackParamList, 'ORDER'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const Routedata = router?.params;
  const [countryCode, setCountryCode] = useState<CountryCode>('ET');
  const [country, setCountry] = useState<Country>();
  const [countryNum, setCountryNum] = useState('251');
  const [number, setnumber] = useState('');
  const [error, setError] = useState(false);
  console.log('data *********', Routedata);
  const [mobileNumber, setMobileNumber] = useState();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(validationDelivery),
  });

  const onClick = async () => {
    setError(true);
    console.log(number);
    try {
      const currAmount =
        Routedata?.type == 'Card' && Routedata?.card?.amount?.amount;

      console.log('curramount ********', currAmount);
      const amt = parseFloat((currAmount || 0)?.toString());
      const feeamt = Routedata?.type == 'Card' && Routedata?.card?.amount?.fee;
      const fees = (parseFloat(feeamt?.toString()) / 100) * amt;
      console.log('fees ********', fees);
      const total = amt + fees;
      const ItemTotal = Routedata?.card;
      console.log('total ********', ItemTotal);
      var body = {
        amount:
          Routedata?.type == 'Card' ? total.toString() : ItemTotal.toString(),
        uuid: Routedata?.uuid,
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
        console.log('res==========>1', data);
        getpaymentUrl(data.data, Routedata?.type == 'Card' ? total : ItemTotal);
      }
    } catch (error) {
      console.log('e===========>', error);
      // handleError(error);
    }
  };

  const getpaymentUrl = async (payload: any, amount: number) => {
    const randomString = Array.from({ length: 5 }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26)),
    ).join('');
    try {
      const bodydata = {
        apikey: randomString, // string
        subject: 'Payment', // string
        return_url: 'https://fetangift.com/tel/notify/', // string,url
        transaction_id: Routedata?.uuid, // string
        amount: amount.toString(), // numeric
        payload: payload, // string
        mobile: countryNum + number, // string with 251
        ussd_id: 1,
      };
      console.log('data ************', bodydata);
      const response = await axios.post(
        'http://hulupay.io/api/pushussd/pay',
        bodydata,
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
        console.log('res==========>', data);
        setnumber('');
      }
    } catch (e) {
      toast.error(e?.response?.data?.msg?.mobile[0] || '');
      console.log('ez===========>', e?.response?.data);
      // handleError(e);
    }
  };

  return (
    <View className="white min-h-full flex-1">
      {Platform.OS == 'ios' && <MyStatusBarComponent />}
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <View style={styles.headerView}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.goBack()}>
            <Ionicons
              name="close"
              size={25}
              color={'#000000'}
              style={styles.leftArrow}
            />
          </TouchableOpacity>
          <View>
            <Image
              source={Images.LOGO}
              className={'h-[55px] object-contain w-[40vw]'}
              resizeMode={'contain'}
            />
          </View>
          <View style={{ marginRight: 20 }}></View>
        </View>
        {Platform.OS == 'android' && (
          <StatusBar backgroundColor={'rgb(204, 0, 0)'} />
        )}
        <View style={{ alignItems: 'center' }}>
          <Image
            source={Images.TELEBIRRNEW}
            style={{ height: '30%', width: '60%' }}
          />
          <Text
            style={{
              color: '#6f6f6f',
              fontSize: 17,
              fontFamily: 'HelveticaNeue-RegularItalic',
              fontWeight: '500',
            }}>
            Enter your telebirr mobile number
          </Text>
          <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <CountryModalProvider>
              <View
                className={`relative flex h-[48px] flex-row w-full mb-3 border}`}>
                <CountryPicker
                  withModal
                  countryCode={countryCode}
                  onSelect={(country: Country) => {
                    console.log(country);
                    // country.field.onChange(e.cca2);
                    // phoneCode.field.onChange(e.callingCode[0] || '');
                    setCountryCode(country.cca2);
                    setCountryNum(country?.callingCode[0]);
                  }}
                  withCallingCode
                  withCallingCodeButton
                  withCloseButton
                  preferredCountries={['US', 'ET']}
                  containerButtonStyle={{
                    backgroundColor: '#eee',
                    height: '100%',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                  }}
                />
                <TextInput
                  className={'flex-1 h-[48px] bg-transparent px-30'}
                  keyboardType="number-pad"
                  placeholder="Enter mobile number"
                  style={{
                    paddingHorizontal: 10,
                    color: '#333',
                  }}
                  onChangeText={text => {
                    setnumber(text);
                  }}
                  value={number}
                />
              </View>
            </CountryModalProvider>
          </View>
          <View style={{ width: '89%', marginTop: 10 }}>
            <Pressable
              className="bg-primary flex h-11 rounded-l items-center justify-center active:bg-primary-accent"
              onPress={() => onClick()}>
              <Text className="text-white text-[16px] text-center font-bold font-target-bold px-7">
                Request
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});
