import { Page } from '@components';
import { RootStackParamList } from '@models';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewScreen = () => {
  const windowHeight = Dimensions.get('window').height;
  const webRef = React.useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute<RouteProp<RootStackParamList, 'PAYMENT'>>();

  return (
    <Page
      onRefresh={webRef.current?.reload}
      isRefresh={isLoading}
      pageLoader={isLoading}
      scrollable={false}>
      <View className="flex-1">
        <WebView
          ref={webRef}
          scalesPageToFit={false}
          mixedContentMode="compatibility"
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          scrollEnabled
          pullToRefreshEnabled
          style={{
            height:
              Platform.OS === 'ios'
                ? windowHeight - (60 + 50)
                : windowHeight - 55,
          }}
          source={{ uri: route.params.url }}
        />
      </View>
    </Page>
  );
};

export default WebViewScreen;
