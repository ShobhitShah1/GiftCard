import { Config } from '@common/constants';
import { Merchant } from '@models';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

export const GiveCardImage: React.FC<{ merchant: Merchant }> = props => {
  const [slider1ActiveSlide, setSlider1ActiveSlide] = useState<number>(0);
  const slider1Ref = useRef<Carousel<any>>(null);

  const renderCarouselItem = ({ item }) => {
    // Check if the item is a full URL or a relative path
    const isFullURL = item.startsWith('http://') || item.startsWith('https://');
    const imageURL = isFullURL ? item : `${Config.BASE_URL}/${item}`;
    // console.log('imageURL', imageURL);

    return (
      <Image
        source={{ uri: imageURL }}
        className="w-[335px] h-[170px] rounded-l "
        resizeMode="cover"
      />
    );
  };

  if (!Array.isArray(props.merchant.images)) {
    // If it's not an array, render a loading spinner
    return (
      <View
        style={{
          width: 280,
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    // <View className="flex relative border w-[280px] max-w-[280px] rounded-2xl bg-opacity-90 shadow border-gray-200 bg-white  h-[150px] relative">
    //   <Image
    //     source={{
    //       uri: props.merchant.image,
    //     }}
    //     className="w-[280px] h-[150px] rounded-2xl "
    //     resizeMode="cover"
    //   />
    // </View>

    <View>
      {props.merchant &&
        props.merchant?.images &&
        props.merchant?.images?.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {slider1ActiveSlide !== 0 && props.merchant.images.length > 1 ? (
              <TouchableOpacity
                onPress={() => slider1Ref.current?.snapToPrev()}>
                <Image
                  style={{ width: 24, height: 24, marginRight: 5 }}
                  source={require('../../../assets/images/left-arrow.png')}
                />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 24, height: 24, marginRight: 5 }}></View>
            )}
            <View>
              <Carousel
                ref={slider1Ref}
                data={props.merchant?.images}
                renderItem={renderCarouselItem}
                sliderWidth={335}
                itemWidth={335}
                loop={false}
                pagingEnabled
                // disableIntervalMomentum
                // lockScrollWhileSnapping
                enableMomentum={false}
                decelerationRate={0.25}
                onSnapToItem={index => setSlider1ActiveSlide(index)}
              />
            </View>
            {slider1ActiveSlide + 1 !== props.merchant.images.length &&
            props.merchant.images.length > 1 ? (
              <TouchableOpacity
                onPress={() => slider1Ref.current?.snapToNext()}>
                <Image
                  style={{ width: 24, height: 24, marginLeft: 5 }}
                  source={require('../../../assets/images/right-arrow.png')}
                />
              </TouchableOpacity>
            ) : (
              <View style={{ width: 24, height: 24, marginLeft: 5 }}></View>
            )}
          </View>
        )}
      {/* {props.merchant &&
        props.merchant.images &&
        props.merchant.images.length > 0 && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            <Pagination
              animatedDuration={0}
              // dotsLength={props.merchant.images?.length}
              activeDotIndex={slider1ActiveSlide}
              containerStyle={{
                justifyContent: 'center',
                marginVertical: -15,
                alignItems: 'center',
                alignSelf: 'center',
              }}
              inactiveDotStyle={{
                width: 20,
                height: 20,
                borderRadius: 70,
                backgroundColor: 'rgba(0, 3, 27, 0.3)',
              }}
              // dotStyle={{
              //   marginHorizontal: -5,
              //   width: 10,
              //   height: 10,
              //   backgroundColor: 'rgba(0, 3, 27, 1)',
              //   borderRadius: 70,
              // }}
            />
          </View>
        )} */}
    </View>
  );
};
