import React, { FC } from 'react';
import Modal from 'react-native-modal';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { FieldValues, useForm } from 'react-hook-form';
import { InputField } from '@components';
import { useAuth, useDeviceToken } from '@common/hooks';
import { getDeviceToken } from '@common/helper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@models';
import { StackActions } from '@react-navigation/native';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type Props = Pick<React.ComponentProps<typeof Modal>, 'isVisible'> & {
  onModalHide(visible: boolean): void;
};

export const AuthModal = React.forwardRef<Modal, Props>(
  ({ onModalHide, ...props }, ref) => {
    return (
      <Modal
        {...props}
        swipeDirection={'down'}
        propagateSwipe={true} // Allow swiping down to close the modal even when the keyboard is open
        avoidKeyboard={true} // Adjust the modal's position to avoid the keyboa
        onSwipeComplete={() => onModalHide(false)}
        style={{
          justifyContent: 'flex-end',
        }}>
        <View
          className={'bg-white px-1 rounded-lg'}
          style={{
            marginHorizontal: -10,
            marginBottom: Platform.OS === 'ios' ? -2 : -10,
          }}>
          <LoginForm />
        </View>
      </Modal>
    );
  },
);

const validation = yup.object({
  identifier: yup.string().required(),
  password: yup.string().min(6).required(),
});

const LoginForm = () => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validation),
  });
  const {
    action: { login, state },
  } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const deviceToken = useDeviceToken();

  const onSubmit = (value: FieldValues) => {
    login({ token: deviceToken || '', ...value }, false);
  };
  return (
    <View className="p-5 pb-10">
      <Text className="text-dark font-target-bold mb-5 text-lg">
        Please login to your account
      </Text>
      {state.error && (
        <View className="bg-red-100 mb-3 border border-red-400 px-4 py-3 rounded relative">
          <Text className="text-red-700">Invalid credentials.</Text>
        </View>
      )}
      <InputField
        name="identifier"
        control={control}
        label={'Enter username or email'}
      />
      <InputField
        name="password"
        control={control}
        label={'Enter Password'}
        isPassword
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
      {/* onPress={() => navigation.dispatch(StackActions.replace('REGISTER'))} */}
      <Pressable
        className="py-2 px-3 mt-3 rounded items-center justify-center active:bg-gray-100"
        onPress={() => {
          // navigation.navigate('ROOT', {
          //   params: {
          //     screen: 'HOME_INDEX',
          //       screen: 'AUTH'
          //   },
          // });
          navigation.navigate('AUTH', {
            screen: 'REGISTER',
          });

          // navigation.navigate('TABSTACK', {
          //   screen: 'REGISTER',
          // });
          // navigation.dispatch(StackActions.replace('TABSTACK', {
          //   // screen: 'REGISTER'
          // }))
        }}>
        <Text className="text-[16px] text-center font-bold font-target-bold">
          Register
        </Text>
      </Pressable>
      {state.isLoading && (
        <View className="absolute flex justify-center top-0 bottom-0 left-0 right-0 bg-gray-900/50">
          <ActivityIndicator color={'#fff'} />
        </View>
      )}
    </View>
  );
};
