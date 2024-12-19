/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Pressable, Text, TextInput } from 'react-native';
import { AuthPage, InputField, MobileInput } from '@components';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRegisterMutation } from '@services/api';
import { useAuth } from '@common/hooks';
import { toast } from '@backpackapp-io/react-native-toast';

const schema = yup
  .object({
    name: yup.string().required(),
    username: yup.string().min(5, 'at least 5 characters').required(),
    password: yup.string().min(6, 'at least 6 characters').required(),
    mobile_number: yup.string().required(),
    email: yup.string().email().required(),
    password_confirmation: yup
      .string()
      .required()
      .oneOf([yup.ref('password'), ''], "Password doesn't match."),
  })
  .required();

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: 'ET',
      phoneCode: '+251',
    },
  });

  const inputsRef = React.useRef<{ [k in string]: TextInput | null }>({});

  const [postData, { isLoading, isSuccess, isError, data }] =
    useRegisterMutation();
  const onSubmit = (value: FieldValues) => {
    postData(value);
  };
  const uAuth = useAuth();

  React.useEffect(() => {
    if (data?.data) {
      uAuth.action.setUser(data?.data);
      toast.success(data.message || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);
  return (
    <AuthPage title="Create account" pageLoader={isLoading}>
      <View className="flex mt-10">
        <InputField name="name" control={control} label={'Your name'} />
        <MobileInput control={control} name="mobile_number" />
        <InputField
          ref={ref => (inputsRef.current.username = ref)}
          name="username"
          control={control}
          label={'Username'}
          textContentType={'username'}
          autoCapitalize={'none'}
          returnKeyLabel={'Next'}
          returnKeyType={'next'}
          onSubmitEditing={() => inputsRef.current.email?.focus()}
        />
        <InputField
          ref={ref => (inputsRef.current.email = ref)}
          name="email"
          control={control}
          label={'Enter email address'}
          keyboardType={'email-address'}
          inputMode={'email'}
          returnKeyType={'next'}
          returnKeyLabel={'Next'}
          autoCapitalize={'none'}
          onSubmitEditing={() => inputsRef.current.password?.focus()}
        />
        <InputField
          ref={ref => (inputsRef.current.password = ref)}
          name="password"
          control={control}
          label={'Enter Password'}
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
              Sign Up
            </Text>
          </Pressable>
        </View>
        <View className="mt-2 flex flex-row justify-center items-center">
          <Text className="text-gray-500 mr-1">Already have an account?</Text>
          <Pressable
            className="active:opacity-[0.6]"
            onPress={() => {
              navigation.goBack();
            }}>
            <Text className="text-blue-500 font-medium font-target-medium">
              Sign in
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthPage>
  );
};

export default RegisterScreen;
