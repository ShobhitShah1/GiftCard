import { AuthPage, InputField } from '@components';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View, Pressable } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '@common/hooks';
import { AccountApi } from '@services/api/account';
import { toast } from '@backpackapp-io/react-native-toast';
import { useVerifyMutation } from '@services/api';
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { RootStackParamList } from '@models';

const OtpScreen: React.FC = () => {
  const { control } = useForm();
  const [timer, setWaitTimer] = useState(0);
  const timerRef = React.useRef<number | null>(null);
  const { user, action, _token } = useAuth();
  const [resendCode, resendState] = AccountApi.useLazyResendCodeQuery();
  const [verifyAccount, verifyState] = useVerifyMutation();
  const [code, setCode] = useState('');
  const inputRef = useRef<OTPInputView | undefined | null>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (timer > 0) {
      timerRef.current = setTimeout(() => {
        setWaitTimer(prev => prev - 1);
      }, 1000);
    }
  }, [timer]);

  const onResend = () => {
    resendCode();
    setWaitTimer(60);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (resendState.isSuccess && resendState.data?.message) {
      toast.success(resendState.data.message || '');
    }
  }, [resendState.isSuccess, resendState.data]);

  return (
    <AuthPage
      title="Please verify your GiftCard account"
      headerIcon=""
      pageLoader={resendState.isLoading || verifyState.isLoading}>
      <View className="flex mt-5 px-5 items-center">
        <Text
          style={{ maxWidth: '90%' }}
          className="text-center text-gray-600 mb-6">
          Please enter the OTP sent to your mobile number{' '}
          <Text className="font-target-bold font-bold">
            +{user?.phoneCode}-{user?.mobile_number}
          </Text>
        </Text>
        <OTPInputView
          pinCount={6}
          style={{ height: 80, maxWidth: 350 }}
          codeInputFieldStyle={{
            color: '#333',
            borderColor: 'rgba(0,0,0,.5)',
            borderRadius: 8,
            // width: 38,
            // height: 38,
            fontWeight: 'bold',
            fontSize: 20,
          }}
          onCodeChanged={setCode}
          autoFocusOnLoad={false}
        />
        <View style={{ maxWidth: '50%' }}>
          <Text className="text-sm text-center text-gray-600 ">
            Didn't receive code?{' '}
            {timer > 0 ? (
              <Text className="text-blue-600">
                {`Resend code in (00:${timer})`}
              </Text>
            ) : (
              <Text className="text-blue-600" onPress={onResend}>
                {'RESEND'}
              </Text>
            )}
          </Text>
        </View>
        <View className="flex flex-row mt-5">
          <Pressable
            className={`bg-primary flex-1 flex h-11 rounded items-center justify-center active:bg-primary-accent ${
              code.length < 6 ? 'opacity-50' : ''
            }`}
            disabled={code.length < 6}
            onPress={() => {
              verifyAccount({ code: code })
                .unwrap()
                .then(res => {
                  if (res.data) {
                    action.setUser(res.data);
                  }
                })
                .catch(err => {
                  toast.error(err);
                });
            }}>
            <Text className="text-white text-[16px] text-center font-bold font-target-bold">
              Verify Account
            </Text>
          </Pressable>
        </View>
        <Pressable
          className="flex flex-row items-center mt-3 active:bg-gray-100 px-3 py-2 rounded-lg"
          onPress={() => action.logout()}>
          <Icon name="chevron-left" color={'rgb(37 99 235)'} size={16} />
          <Text className="ml-1 text-blue-600 font-target-medium text-sm">
            Signout
          </Text>
        </Pressable>
      </View>
    </AuthPage>
  );
};

export default OtpScreen;
