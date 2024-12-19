import { toast } from '@backpackapp-io/react-native-toast';
import { AuthPage, InputField } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { auth } from '@services/api';
import React, { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { View, Pressable, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as yup from 'yup';

const validation = yup.object({
  email: yup.string().email().required(),
});

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validation),
  });

  const [submit, state] = auth.useResetPasswordMutation();
  const onSubmit = (value: FieldValues) => {
    submit(value);
  };

  useEffect(() => {
    if (state.data && state.isSuccess) {
      toast.success(state.data?.message || '');
    }
  }, [state.isSuccess, state.data]);
  return (
    <AuthPage title="Forgot Password" pageLoader={state.isLoading}>
      <View className="flex flex-row mt-5">
        <InputField
          name="email"
          control={control}
          label={'Enter email address'}
        />
      </View>
      <View className="flex flex-row mt-5">
        <Pressable
          className="bg-primary flex-1 flex h-11 rounded items-center justify-center active:bg-primary-accent"
          onPress={handleSubmit(onSubmit)}>
          <Text className="text-white text-[16px] text-center font-bold font-target-bold">
            Reset Password
          </Text>
        </Pressable>
      </View>
      <Pressable
        className="flex flex-row items-center mt-3 active:opacity-[0.6]"
        onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={16} />
        <Text className="ml-1 text-gray-600">Back to login</Text>
      </Pressable>
    </AuthPage>
  );
};
export default ForgotPasswordScreen;
