import React, { PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Router from './Router';
// import SystemNavigationBar from 'react-native-system-navigation-bar';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store } from '@services/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';

const persistor = persistStore(store);

const App: React.FC<PropsWithChildren> = () => {
  // SystemNavigationBar.stickyImmersive();
  // SystemNavigationBar.fullScreen();
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
              <Router />
          </NavigationContainer>
          <Toasts />
            </GestureHandlerRootView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
