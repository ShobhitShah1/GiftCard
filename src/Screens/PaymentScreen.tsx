import { Page } from '@components';
import { RootStackParamList } from '@models';
import {
  NavigationProp,
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';

const PaymentScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const onMessage = (data: { nativeEvent: { data: any } }) => {
    return navigation.dispatch(StackActions.popToTop());
  };

  const windowHeight = Dimensions.get('window').height;
  const webRef = React.useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute<RouteProp<RootStackParamList, 'PAYMENT'>>();

  return (
    <Page onRefresh={webRef.current?.reload} isRefresh={isLoading}>
      <View className="flex-1">
        <WebView
          ref={webRef}
          scalesPageToFit={false}
          originWhitelist={['*']}
          mixedContentMode="compatibility"
          onMessage={onMessage}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          style={{
            height:
              Platform.OS === 'ios'
                ? windowHeight - (60 + 50)
                : windowHeight - 15,
          }}
          source={{ uri: route.params.url }}
        />
      </View>
    </Page>
  );
};

export default PaymentScreen;
