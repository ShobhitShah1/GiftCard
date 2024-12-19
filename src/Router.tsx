import React, { useEffect, useState } from 'react';

import { MainRoute } from './components';
import { useAuth } from '@common/hooks';
import SplashScreen from './Screens/SplashScreen';
import { Platform } from 'react-native';
import NativeSplash from 'react-native-splash-screen';

const Router: React.FC = () => {
  const {
    authenticated,
    action: { getMe },
  } = useAuth();

  useEffect(() => {
    // logout();
    if (authenticated) {
      getMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timer = Platform.OS === 'ios' ? 1000 : 1500;
    setTimeout(() => {
      setLoading(false);
      NativeSplash.hide();
    }, timer);
  }, []);

  if (isLoading && Platform.OS === 'android') {
    return <SplashScreen />;
  }

  return <MainRoute />;
};

export default Router;
