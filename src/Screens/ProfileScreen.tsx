import { useAuth } from '@common/hooks';
import { InputField, MobileInput, Page } from '@components';
import { AccountApi } from '@services/api/account';
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';

const ProfileScreen: React.FC = () => {
  const {
    user,
    action: { updateUser },
  } = useAuth();
  
  const { control, handleSubmit } = useForm<any>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      mobile_number: user?.mobile_number,
      countryCode: user?.countryCode.toUpperCase(),
      phoneCode: user?.phoneCode,
      username: user?.username,
    },
  });
  const inputsRef = React.useRef<{ [k in string]: TextInput | null }>({});
  const [_, updateState] = AccountApi.useUpdateMutation();
  // const api
  const onSubmit = (value: FieldValues) => {
    updateUser(value);
  };

  return (
    <Page pageLoader={updateState.isLoading}>
      <View className={'container mx-auto py-5 bg-white'}>
        <Text
          className={
            'text-center font-target-bold font-bold text-[20px] text-dark'
          }>
          Update Account
        </Text>
        <View className="flex flex-col flex-1 w-full px-3 mt-5">
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
            editable={false}
          />
          <InputField name="name" control={control} label={'Your name'} />
          <MobileInput control={control} name="mobile_number" />
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
          <View className="flex flex-row mt-5">
            <Pressable
              className="bg-primary flex-1 flex h-11 rounded items-center justify-center active:bg-primary-accent"
              onPress={handleSubmit(onSubmit)}>
              <Text className="text-white text-[16px] text-center font-bold font-target-bold">
                Update Account
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Page>
  );
};

export default ProfileScreen;
