import React, { useEffect } from 'react';
import { View, Pressable, Text, TextInput } from 'react-native';
import { AuthPage, InputField } from '@components';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@common/constants';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLoginMutation } from '@services/api';
import { useAuth, useDeviceToken } from '@common/hooks';
import { getDeviceToken } from '@common/helper';
import { toast } from '@backpackapp-io/react-native-toast';

const schema = yup
  .object({
    identifier: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const dToken = useDeviceToken();

  const onSubmit = (value: FieldValues) => {
    // getDeviceToken()
    //   .then(token => {
    //     login({ token, ...value });
    //   })
    //   .catch(e => {
    //     console.log('token', e);
    //     toast.error(e.message);
    //   });
    login({ token: dToken || '', ...value });
  };

  const {
    action: {
      login,
      state: { isLoading },
    },
  } = useAuth();
  const passwordRef = React.useRef<TextInput>(null);

  return (
    <AuthPage
      title="Sign into your GiftCard account"
      headerIcon="x"
      pageLoader={isLoading}>
      <View className="flex mt-10">
        <InputField
          name="identifier"
          control={control}
          label={'Enter username or email'}
          returnKeyType={'next'}
          keyboardType={'email-address'}
          cursorColor={'rgb(204, 0, 0)'}
          autoCapitalize={'none'}
          onSubmitEditing={() => passwordRef.current?.focus}
        />
        <InputField
          ref={passwordRef}
          name="password"
          control={control}
          label={'Enter Password'}
          isPassword
          autoCapitalize={'none'}
          customShowPasswordComponent={<Text className="text-sm">Show</Text>}
          customHidePasswordComponent={<Text className="text-sm">Hide</Text>}
        />

        <View className="flex flex-row mt-5">
          <Pressable
            className="bg-primary flex-1 flex h-11 rounded items-center justify-center active:bg-primary-accent"
            onPress={handleSubmit(onSubmit)}>
            <Text className="text-white text-[16px] text-center font-bold font-target-bold">
              Sign In
            </Text>
          </Pressable>
        </View>
        <Pressable
          className="mt-2 active:opacity-[0.6]"
          onPress={() => navigation.navigate(Screen.FORGOT_PASSWORD as never)}>
          <Text className="text-center text-gray-500">Forgot password?</Text>
        </Pressable>
        <View className="flex flex-row mt-5">
          <Pressable
            className="bg-white flex-1 flex border border-gray-300 rounded h-11 items-center justify-center active:bg-gray-100"
            onPress={() => {
              navigation.navigate(Screen.REGISTER as never);
            }}>
            <Text className="text-gray-600 text-[16px] text-center font-bold font-target-bold">
              Create account
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthPage>
  );
};

export default LoginScreen;
