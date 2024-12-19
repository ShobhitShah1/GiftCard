import {
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const getDeviceToken = () => {
  return new Promise<string>((resolve, reject) => {
    if (Platform.OS === 'ios') {
      messaging()
        .requestPermission()
        .then(authStatus => {
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          return messaging().getToken();
        })
        .then(res => {
          resolve(res);
        })
        .catch(e => {
          reject(e.message);
        });
    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
        .then(() => messaging().registerDeviceForRemoteMessages())
        .then(() => messaging().getToken())
        .then(res => {
          resolve(res);
        })
        .catch(e => {
          reject(e.message);
        });
    }
  });
};

export function notifyMessage(msg: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert(msg);
  }
}
