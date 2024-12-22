import { Images } from '@common/constants';
import { RootStackParamList } from '@models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { OrderApi } from '@services/api';
import React, { FC, useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ItemDeliveryPage: FC = () => {
  const router = useRoute<RouteProp<RootStackParamList, 'ITEMDELIVERY'>>();
  const params = router.params.merchant;
  const [slider1ActiveSlide, setSlider1ActiveSlide] = useState<number>(0);
  const slider1Ref = useRef<Carousel<any>>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data, error, isLoading } = OrderApi.useDeliveryMenuQuery({
    merchantId: params.id,
  });

  const existingCategories = data?.category || [];

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();

      return () => {};
    }, [count]),
  );

  // Function to fetch cart items from AsyncStorage
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const cartItemsJson = await AsyncStorage.getItem('cartItems');
      setLoading(false);
      if (cartItemsJson !== null) {
        const parsedCartItems = JSON.parse(cartItemsJson);
        const matchingItems = parsedCartItems.filter(
          item => item.merchantId === params?.id,
        );
        // Set count based on the matching items
        const countValue = matchingItems.length > 0 ? matchingItems.length : 0;
        setCount(countValue);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching cart items: ', error);
    }
  };

  const addToCart = async (item: any) => {
    try {
      const isDuplicate = cartItems.some(cartItem => cartItem.id === item.id);
      if (isDuplicate) {
        return;
      }
      const itemWithMerchantId = { ...item, merchantId: params?.id };
      const updatedCartItems = [...cartItems, itemWithMerchantId];
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      setCount(updatedCartItems?.length); // Update the count state with the new length of cartItems
    } catch (error) {
      console.error('Error adding item to cart: ', error);
    }
  };

  const updatedMenuData =
    existingCategories.length > 0
      ? [
          {
            id: 0,
            name: 'All',
          },
          ...existingCategories,
        ]
      : existingCategories;

  const filteredMerchantItems = React.useMemo(() => {
    if (selectedCategory === 0) {
      // Return all items if the category is 0 (All)
      return data?.allItems;
    } else {
      // Return items filtered by selected category id
      return data?.allItems.filter(
        item => item.bizitem.id === selectedCategory,
      );
    }
  }, [data?.allItems, selectedCategory, count]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor={'rgb(204, 0, 0)'} />
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
            <Text style={styles.headerText}>{params.name}</Text>
          </View>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => {
              navigation.navigate('CARTITEM', {
                merchant: router.params.merchant,
                categoryId: router.params?.categoryId || 0,
                cartItem: cartItems,
                cartCount: cartItems.length,
                deliveryFee: data?.DeliveryFee,
                DeliveryFee_usd: data?.DeliveryFee_usd,
                Currency: data?.merchant?.active_currency,
              });
            }}>
            <Ionicons name="cart-sharp" size={26} color={'#000000'} />
            <Text style={styles.countText}>{count}</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.carouselMainView}>
          {existingCategories?.length > 1 ? (
            <TouchableOpacity onPress={() => slider1Ref.current?.snapToPrev()}>
              <Image
                style={[styles.leftIcon]}
                source={require('../../../assets/images/left-arrow.png')}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.spaceView}></View>
          )}
          <View style={styles.carouselInsideView}>
            <Carousel
              ref={slider1Ref}
              data={updatedMenuData}
              // firstItem={1}
              activeSlideAlignment={'start'}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.categoryBackground,
                      {
                        borderColor:
                          selectedCategory === item.id ? '#316BEC' : '#D2D5D8',
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
                            selectedCategory === item.id
                              ? '#316BEC'
                              : '#4F5360',
                        },
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              sliderWidth={270}
              itemWidth={130}
              enableMomentum={false}
              decelerationRate={0.25}
              loop={false}
              onSnapToItem={index => {
                setSlider1ActiveSlide(index);
                setSelectedCategory(updatedMenuData[index]?.id || 0);
              }}
              inactiveSlideScale={1} // Set the scale of inactive slides to 1 (no scaling)
              inactiveSlideOpacity={1} // Set the opacity of inactive slides to 1 (fully visible)
            />
          </View>
          {existingCategories?.length > 1 ? (
            <TouchableOpacity onPress={() => slider1Ref.current?.snapToNext()}>
              <Image
                style={[styles.rightIcon]}
                source={require('../../../assets/images/right-arrow.png')}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.rightSpace}></View>
          )}
        </View> */}
        <View style={styles.carouselMainView}>
          <FlatList
            data={updatedMenuData}
            horizontal
            style={{ marginRight: 10 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.categoryBackground,
                    {
                      borderColor:
                        selectedCategory === item.id ? '#316BEC' : '#D2D5D8',
                      marginLeft: 5,
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
                          selectedCategory === item.id ? '#316BEC' : '#4F5360',
                      },
                    ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {/* {data?.allItems?.length > 0 ? ( //">" */}
          {/* {loading ? (
            <View style={{flex : 1 , justifyContent : 'center' , alignItems : 'center' , marginTop : 150}}>
            <ActivityIndicator size="large" color="rgb(204, 0, 0)" />
            </View>
          ) : ( */}
          {!loading && filteredMerchantItems && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredMerchantItems}
              contentContainerStyle={{
                flex: data?.allItems?.length > 0 ? undefined : 1,
              }}
              style={{
                marginTop: data?.allItems?.length > 0 ? 40 : 0,
                marginBottom: 120,
                marginHorizontal: 25,
              }}
              renderItem={({ item }) => {
                if (!item || !item.bizitem) {
                  return null;
                }

                return (
                  <View style={styles.flatView}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    <Text style={styles.itemText}>
                      {item.bizitem.item_name}
                    </Text>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                    <View style={styles.priceNdQtyView}>
                      <Text style={styles.priceText}>
                        Bir {item.price_birr}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.cartView}
                        onPress={() => addToCart(item)}>
                        <Image
                          source={Images.ADDCART}
                          style={styles.cartImage}
                        />
                        <Text style={styles.CartText}>ADD TO CART</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={() => (
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text
                    style={{
                      color: '#000000',
                      fontSize: 20,
                      textAlign: 'center',
                      fontFamily: 'HelveticaNeue-Bold',
                    }}>
                    No items available
                  </Text>
                  <Text
                    style={{
                      fontSize: 25,
                      color: '#565656',
                      textAlign: 'center',
                      fontFamily: 'HelveticaNeue-RegularItalic',
                      fontWeight: '400',
                      padding: 20,
                      paddingTop: 50,
                    }}>
                    Sorry..this merchant doesn't have delivery service yet. You
                    can only send a gift card.
                  </Text>
                </View>
              )}
            />
          )}

          {/* )} */}
          {/* ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{ color: '#000000', fontSize: 25, textAlign: 'center',fontFamily: 'HelveticaNeue-Bold'}}>
                No items available
              </Text>
              <Text style={{fontSize: 22, color: '#000', textAlign: 'center', fontFamily: 'HelveticaNeue-Medium'}}>Sorry..this merchant doesn't have delivery service yet. You can only send a gift card.</Text>
            </View>
          )} */}
        </View>
      </View>
      {loading && (
        <View style={{ position: 'absolute', top: '50%', left: '50%' }}>
          <ActivityIndicator size="large" color="rgb(204, 0, 0)" />
        </View>
      )}
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
  countText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000000',
    marginTop: -7,
    marginLeft: 4,
  },
  rightSpace: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  carouselMainView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 10,
  },
  carouselInsideView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBackground: {
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 15,
    borderColor: '#D2D5D8',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    backgroundColor: '#FFFFFF',
    width: 100,
  },
  categoryText: {
    padding: Platform.OS == 'ios' ? 5 : 3,
    fontWeight: '600',
    fontFamily: 'HelveticaNeue-Medium',
  },
  rightIcon: {
    width: 20,
    height: 20,
    marginRight: 14,
    marginLeft: 5,
    tintColor: 'grey',
  },
  leftIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
    marginLeft: 5,
    tintColor: 'grey',
  },
  spaceView: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  flatView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    height: 210,
    width: 300,
    resizeMode: 'cover',
    // resizeMode: 'contain',
    // backgroundColor: 'red'
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
    textAlign: 'center',
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
  CartText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    padding: 6,
  },
  cartView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(204, 0, 0)',
    borderRadius: 20,
    marginLeft: 10,
    paddingHorizontal: 2,
  },
  cartImage: {
    height: 14,
    width: 14,
    marginLeft: 8,
    tintColor: '#FFFFFF',
  },
});
