import React, { PropsWithChildren } from 'react';
import { ActivityIndicator } from 'react-native';
import {
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Platform,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Header } from '../header';

type Props = PropsWithChildren & {
  header?: boolean;
  statusBar?: React.ComponentProps<typeof StatusBar>;
  contentBottom?: React.ReactElement | React.ReactNode;
  pageLoader?: boolean;
  isRefresh?: boolean;
  onRefresh?(): void;
  headerRight?: React.ComponentProps<typeof Header>['right'];
  scrollable?: boolean;
  customStyle?: any
};
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

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

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const MyStatusBar: React.FC<Props['statusBar']> = props => {
  const isFocus = useIsFocused();
  if (!isFocus) {
    return null;
  }
  return (
    <View
      style={{
        height: StatusBarHeight,
        backgroundColor: props?.backgroundColor,
        // paddingTop: STATUSBAR_HEIGHT,
      }}>
      <SafeAreaView>
        <StatusBar {...props} />
      </SafeAreaView>
    </View>
  );
};

export const Page: React.FC<Props> = ({
  children,
  header,
  statusBar,
  headerRight,
  scrollable,
  customStyle,
  ...props
}) => {
  const controls =
    typeof props.onRefresh !== 'undefined'
      ? {
          refreshControl: (
            <RefreshControl
              refreshing={props.isRefresh ? true : false}
              onRefresh={props.onRefresh}
            />
          ),
        }
      : {};

  const windowHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const styles = props.contentBottom
    ? {
        height:
          Platform.OS === 'ios'
            ? windowHeight - (insets.top + insets.bottom)
            : windowHeight - (insets.top + insets.bottom),
      }
    : {};

  const Container = React.useMemo(
    () => (scrollable ? ScrollView : View),
    [scrollable],
  );

  return (
    <View className="white min-h-full flex-1" style={customStyle}>
      <MyStatusBar {...statusBar} translucent />
      {/* <StatusBar animated={true} {...statusBar} translucent /> */}
      <View
        className="relative bg-white"
        style={{
          flex: 1,
        }}>
        {/* <View className="relative flex-1"> */}
        {header && <Header right={headerRight} />}
        {/* <View className="flex-1"> */}
        <Container
          className={'relative flex-1'}
          // keyboardShouldPersistTaps="always"
          // scrollEnabled={false}
          style={{
            ...styles,
            paddingBottom: insets.bottom,
            marginTop: header
              ? insets.top + (Platform.OS === 'ios' ? 18 : 38)
              : 0,
          }}
          {...controls}>
          {children}
        </Container>
        {props.contentBottom}
        {/* </View> */}
        {/* </View> */}
        {props.pageLoader && (
          <View className="absolute top-0 right-0 left-0 bottom-0 h-screen bg-gray-900/20 flex justify-center items-center">
            <View className="rounded-lg w-50 h-50 bg-dark/50 p-4">
              <ActivityIndicator color={'#fff'} size={24} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

Page.defaultProps = {
  header: true,
  statusBar: {
    backgroundColor: 'rgb(204, 0, 0)',
    barStyle: 'light-content',
  },
  scrollable: true,
};
