import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from 'react-native-modal';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Carousel from 'react-native-snap-carousel';
import { BASE_URL, IMAGE_URL } from '@common/constants';
import { UseControllerProps, useController } from 'react-hook-form';
import { SafeAreaView } from 'react-native';

interface UserData {
  id: number;
  name: string;
}

interface ItemData {
  id: number;
  name: string;
  image: string;
  price: string;
  rate: number;
  desc: string;
}

type PriceFieldController = ReturnType<typeof useController>;

type Props = Pick<React.ComponentProps<typeof Modal>, 'isVisible'> & {
  onModalHide(visible: boolean): void;
  title: string;
  merchantItem: any[];
  Menu: any[];
  setMerchantItem(merchantItem: []): void;
  PriceField: PriceFieldController;
  incrementCounter: (itemId: string) => void; // Specify the correct type for incrementCounter
  decrementCounter: (itemId: string) => void;
  quantity: Record<string, number>;
};

export const PriceMenuModal = React.forwardRef<Modal, Props>(
  ({ onModalHide, ...props }, ref) => {
    return (
      <Modal
        {...props}
        onBackdropPress={() => {
          onModalHide(false);
        }}
        onBackButtonPress={() => {
          onModalHide(false);
        }}
        style={{
          flex: 1,
          margin: 0,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
          }}>
          <PriceShow {...props} onModalHide={onModalHide} />
        </View>
      </Modal>
    );
  },
);

const PriceShow: React.FC<
  Pick<
    Props,
    | 'isVisible'
    | 'title'
    | 'merchantItem'
    | 'setMerchantItem'
    | 'Menu'
    | 'onModalHide'
    | 'PriceField'
    | 'incrementCounter'
    | 'decrementCounter'
    | 'quantity'
  >
> = ({ onModalHide, ...props }) => {
  const [slider1ActiveSlide, setSlider1ActiveSlide] = useState<number>(0);
  const slider1Ref = useRef<Carousel<any>>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  //Filter Cateory wise data
  const filteredMerchantItems = useMemo(() => {
    if (selectedCategory === 0) {
      // Return all items if the category is 0 (All)
      return props.merchantItem;
    } else {
      // Return items filtered by selected category id
      return props.merchantItem.filter(
        item => item.bizitem.id === selectedCategory,
      );
    }
  }, [props.merchantItem, selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerView}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onModalHide(false)}>
            <Feather
              name="arrow-left"
              size={25}
              color={'#000000'}
              style={styles.leftArrow}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>{props.title}</Text>
        </View>
        <View style={styles.subTitileView}>
          <Text style={styles.subTitleText}>Check out our menu</Text>
        </View>
        <View style={styles.carouselMainView}>
          {props.Menu?.length > 1 ? (
            <TouchableOpacity onPress={() => slider1Ref.current?.snapToPrev()}>
              <Image
                style={[
                  styles.leftIcon,
                  {
                    tintColor:
                      slider1ActiveSlide !== 0 && props.Menu?.length > 1
                        ? '#F7B614'
                        : '#000000',
                  },
                ]}
                source={require('../../../assets/images/left-arrow.png')}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.spaceView}></View>
          )}
          <View style={styles.carouselInsideView}>
            <Carousel
              ref={slider1Ref}
              data={props.Menu}
              // firstItem={1}
              activeSlideAlignment={'start'}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryBackground,
                    {
                      backgroundColor:
                        selectedCategory === item.id ? '#F7B614' : '#000000',
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSlider1ActiveSlide(index);
                    setSelectedCategory(item.id);
                  }}>
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color:
                          selectedCategory === item.id ? '#FFFFFF' : '#F7B614',
                      },
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              sliderWidth={270}
              itemWidth={130}
              enableMomentum={false}
              decelerationRate={0.25}
              loop={false}
              onSnapToItem={index => {
                setSlider1ActiveSlide(index);
                setSelectedCategory(props.Menu[index].id);
              }}
              inactiveSlideScale={1} // Set the scale of inactive slides to 1 (no scaling)
              inactiveSlideOpacity={1} // Set the opacity of inactive slides to 1 (fully visible)
            />
          </View>
          {props.Menu?.length > 1 ? (
            <TouchableOpacity onPress={() => slider1Ref.current?.snapToNext()}>
              <Image
                style={[
                  styles.rightIcon,
                  {
                    tintColor:
                      slider1ActiveSlide + 1 !== props.Menu?.length ||
                      (0 <= 0 && props.Menu?.length > 1)
                        ? '#F7B614'
                        : '#000000',
                  },
                ]}
                source={require('../../../assets/images/right-arrow.png')}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.rightSpace}></View>
          )}
        </View>
        <View>
          {props.merchantItem?.length > 0 ? (
            <FlatList
              data={filteredMerchantItems}
              style={{ marginTop: 40, marginBottom: 120 }}
              renderItem={({ item }) => {
                if (!item || !item.bizitem) {
                  return null; // Skip rendering if item or bizitem is undefined
                }
                const itemId = item.id; // Assuming itemId is unique for each item
                const itemQuantity = props.quantity[itemId] || 1;
                return (
                  <View style={styles.flatView}>
                    <TouchableOpacity
                      onPress={() => {
                        props.setMerchantItem(item);
                        onModalHide(false);
                        props.PriceField.field.onChange(item.id);
                      }}
                      activeOpacity={0.5}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <Text style={styles.itemText}>
                      {item.bizitem.item_name}
                    </Text>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                    <View style={styles.priceNdQtyView}>
                      <Text style={styles.priceText}>
                        Birr{item.price_birr}
                      </Text>
                      <View style={styles.qtyView}>
                        <TouchableOpacity
                          activeOpacity={0.3}
                          style={styles.decrementView}
                          onPress={() => props.decrementCounter(itemId)}>
                          <Text style={styles.text}>-</Text>
                        </TouchableOpacity>
                        <View>
                          <Text style={styles.qtyText}>{itemQuantity}</Text>
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.3}
                          style={styles.decrementView}
                          onPress={() => props.incrementCounter(itemId)}>
                          <Text style={styles.text}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text
                style={{ color: '#000000', fontSize: 20, fontWeight: '700' }}>
                No items available
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
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
  subTitileView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  subTitleText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 20,
  },
  carouselMainView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  leftIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
    marginLeft: 5,
  },
  spaceView: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  rightSpace: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  carouselInsideView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBackground: {
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryText: {
    padding: 11,
    fontWeight: '700',
    fontFamily: 'Righteous-Regular',
  },
  rightIcon: {
    width: 20,
    height: 20,
    marginRight: 14,
    marginLeft: 5,
  },
  flatView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    height: 200,
    width: 300,
  },
  itemText: {
    paddingTop: 10,
    color: '#000000',
    fontWeight: '800',
    fontSize: 20,
    fontFamily: 'Nasir Udin - MondiaThin',
  },
  itemDesc: {
    paddingTop: 2,
    color: '#696969',
    fontWeight: '600',
    fontSize: 17,
  },
  priceNdQtyView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  priceText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 19,
  },
  qtyView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    justifyContent: 'space-around',
    width: '30%',
    backgroundColor: '#FFFFFF',
  },
  decrementView: {
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7B614',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  qtyText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '800',
  },
});
