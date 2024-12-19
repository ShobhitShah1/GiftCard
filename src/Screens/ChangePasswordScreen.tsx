import { toast } from '@backpackapp-io/react-native-toast';
import { InputField, Page } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { AccountApi } from '@services/api/account';
import React, { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as yup from 'yup';

const validation = yup
  .object({
    password: yup.string().required(),
    new_password: yup.string().min(6).required(),
    password_confirmation: yup
      .string()
      .required()
      .oneOf([yup.ref('new_password'), ''], "Password doesn't match."),
  })
  .required();

const ChangePasswordScreen: React.FC = () => {
  const inputsRef = React.useRef<{ [k in string]: TextInput | null }>({});
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validation),
  });

  const [_updatePassword, state] = AccountApi.useChangePasswordMutation();
  const onSubmit = (value: FieldValues) => {
    _updatePassword(value);
  };

  useEffect(() => {
    if (state.isSuccess) {
      toast.success(state.data.message || '');
      state.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data, state.isSuccess]);

  return (
    <Page pageLoader={state.isLoading}>
      <View className={'container mx-auto bg-white py-5 bottom-0'}>
        <Text
          className={
            'text-center font-target-bold font-bold text-[20px] text-dark'
          }>
          Change Password
        </Text>
        <View className="px-3 mt-10">
          <InputField
            ref={ref => (inputsRef.current.currentPassword = ref)}
            name="password"
            control={control}
            label={'Current Password'}
            isPassword
            customShowPasswordComponent={<Icon name="eye" size={16} />}
            customHidePasswordComponent={<Icon name="eye-off" size={16} />}
            textContentType={'password'}
            returnKeyType={'next'}
            returnKeyLabel={'Next'}
            onSubmitEditing={() => inputsRef.current.password?.focus()}
          />
          <View className="h-[1px] bg-gray-300 my-5" />
          <InputField
            ref={ref => (inputsRef.current.password = ref)}
            name="new_password"
            control={control}
            label={'New Password'}
            isPassword
            customShowPasswordComponent={<Icon name="eye" size={16} />}
            customHidePasswordComponent={<Icon name="eye-off" size={16} />}
            textContentType={'password'}
            returnKeyType={'next'}
            returnKeyLabel={'Next'}
            onSubmitEditing={() =>
              inputsRef.current.password_confirmation?.focus()
            }
          />
          <InputField
            ref={ref => (inputsRef.current.password_confirmation = ref)}
            name="password_confirmation"
            control={control}
            label={'Re-type your password'}
            isPassword
            customShowPasswordComponent={<Icon name="eye" size={16} />}
            customHidePasswordComponent={<Icon name="eye-off" size={16} />}
          />
          <View className="flex flex-row mt-5">
            <Pressable
              className="bg-primary flex-1 flex h-11 rounded items-center justify-center active:bg-primary-accent"
              onPress={handleSubmit(onSubmit)}>
              <Text className="text-white text-[16px] text-center font-bold font-target-bold">
                Change Password
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Page>
  );
};

export default ChangePasswordScreen;
