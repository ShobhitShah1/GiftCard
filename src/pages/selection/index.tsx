/* eslint-disable react-native/no-inline-styles */
import { Images } from '@common/constants';
import { Page } from '@components';
import { Header } from '@components/header';
import { RootStackParamList } from '@models';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { FC } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
import { Platform } from 'react-native';
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height, width } = Dimensions.get('window');

export const isIPhoneX = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV
    ? (width === X_WIDTH && height === X_HEIGHT) ||
      (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    : false;

export const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 44 : 47,
  android: StatusBar.currentHeight,
  default: 0,
});

const MyStatusBar = ({ ...props }) => {
  return (
    <View
      style={{
        height: StatusBarHeight,
        backgroundColor: 'rgb(204, 0, 0)',
        // paddingTop: STATUSBAR_HEIGHT,
      }}>
      <SafeAreaView>
        <StatusBar {...props} />
      </SafeAreaView>
    </View>
  );
};

export const SelectionPage: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const router = useRoute<RouteProp<RootStackParamList, 'SELECTION'>>();

  const params = router.params.merchant;

  //ITEMDELIVERY
  // console.log('params ******************', params);

  return (
    // <Page customStyle={{flex : 1 , justifyContent : 'center' , margin : 0 , padding:  0, width : '100%'}}>
    // <SafeAreaView style={{ flex: 1 }}>
    <View className="white min-h-full flex-1">
      {Platform.OS === 'ios' && <MyStatusBar />}

      <View
        style={{
          flex: 1,
          // justifyContent: 'center',
          // alignItems: 'center',
          paddingTop: StatusBar?.currentHeight + 50,
        }}>
        {<Header />}
        {Platform.OS === 'android' && (
          <StatusBar backgroundColor={'rgb(204, 0, 0)'} />
        )}

        <View>
          <Text
            style={[
              styles.selectWayText,
              {
                bottom: Platform.OS === 'ios' ? 0 : 0,
                marginTop: Platform.OS === 'android' ? 0 : 15,
              },
            ]}>
            Select your way of sending
          </Text>
        </View>
        <View className=" items-center mt-1 w-100">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('ORDER', {
                merchant: router.params.merchant,
                categoryId: router.params?.categoryId || 0,
              });
            }}>
            <ImageBackground
              source={Images.GIFTCARD}
              resizeMode="contain"
              style={[
                styles.BackgroundImageStyle,
                {
                  marginTop: Platform.OS === 'ios' ? 6 : 2,
                },
              ]}>
              <View style={styles.merchantInDelivery}>
                <Text numberOfLines={1} style={styles.merchantName}>
                  {params.name}
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('ITEMDELIVERY', {
                merchant: router.params.merchant,
                categoryId: router.params?.categoryId || 0,
              });
            }}>
            <ImageBackground
              source={Images.DELIVERY}
              resizeMode="contain"
              style={[
                styles.BackgroundImageStyle,
                {
                  top: Platform.OS === 'ios' ? 6 : 3,
                },
              ]}>
              <View style={styles.merchantInDelivery}>
                <Text numberOfLines={1} style={[styles.merchantName]}>
                  {params.name}
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    </View>

    // </SafeAreaView>
    // </Page>
  );
};

const styles = StyleSheet.create({
  selectWayText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    paddingTop: 15,
    paddingBottom: 10,
    fontFamily: 'HelveticaNeue-Bold',
    // fontWeight: '600',
  },
  giftCardTextView: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  giftCardText: {
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-RegularItalic',
    fontSize: 26,
    color: '#656565',
    fontWeight: '600',
    paddingTop: 25,
  },
  merchantName: {
    // left: 29,
    bottom: 4,
    width: '90%',
    fontSize: 21,
    lineHeight: 21,
    color: 'rgb(204, 0, 0)',
    fontFamily: 'cretype-Caros-Medium',
  },
  orText: {
    color: 'rgb(204, 0, 0)',
    fontWeight: '400',
    fontFamily: 'HelveticaNeue-Regular',
    fontSize: 28,
    marginTop: 5,
  },
  merchantInDelivery: {
    position: 'absolute',
    // alignItems: 'center',
    top: 0,
    bottom: 0,
    // left: 10,
    right: 0,
    width: '62%',
    // alignSelf: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  DeliveryText: {
    color: '#656565',
    fontSize: 26,
    fontFamily: 'HelveticaNeue-RegularItalic',
    // marginTop: Platform.OS == 'ios' ? 9 : 5,
    // fontWeight: '600',
  },
  BackgroundImageStyle: {
    height: 190,
    width: 330,
    justifyContent: 'flex-end',
  },
});
