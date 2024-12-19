import { toast } from '@backpackapp-io/react-native-toast';
import { InputField, Page } from '@components';
import React, { Component, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import * as yup from 'yup';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { auth } from '@services/api';

const validation = yup
  .object({
    username: yup.string().required(),
    email: yup.string().email().required(),
    message: yup.string(),
  })

  .required();

const DeleteAccount: React.FC = () => {
  const inputsRef = React.useRef<{ [k in string]: TextInput | null }>({});

  const { control, handleSubmit , reset } = useForm({
    resolver: yupResolver(validation),
  });

  const [DeleteAccount, state] = auth.useDeleteAccountMutation();

  const onSubmit = (value: FieldValues) => {
    DeleteAccount(value);
  };

  useEffect(() => {
    console.log('state delete ****************', state);
    if (state.isSuccess) {
      toast.success(state.data.message || '');
      reset()
      // state.reset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data, state.isSuccess]);

  return (
    <Page>
      <View className={'container mx-auto bg-white py-5 bottom-0'}>
        <Text
          className={'font-target-bold font-bold text-[20px] text-dark px-3 text-center'}>
          Request us to delete your account
        </Text>
        <View className="px-3 mt-10">
          <View>
            <Text className="mb-1 text-sm text-gray-500">User name</Text>
            <InputField
              name="username"
              control={control}
              label={'Enter your user name'}
            />
          </View>
          <View>
            <Text className="mb-1 text-sm text-gray-500">Email address</Text>
            <InputField
              name="email"
              control={control}
              label={'Enter email address'}
            />
          </View>
          <View>
            <Text className="mb-1 text-sm text-gray-500">Message</Text>
            <Controller
              control={control}
              render={({ field }) => (
                <TextInput
                  className={`border h-[80px] text-gray-900 text-sm focus:ring-gray-500 focus:bg-slate-100 focus:border-gray-500 block w-full p-2.5 `}
                  multiline
                  numberOfLines={3}
                  style={{
                    textAlignVertical: 'top',
                  }}
                  placeholder={'Enter your message'}
                  value={field.value}
                  onChangeText={text => field.onChange(text)}
                />
              )}
              name="message"
              rules={{ required: 'Message is required' }}
            />
          </View>
          <View className="flex flex-row mt-5">
            <Pressable
              className="bg-primary flex h-11 rounded-3xl items-center justify-center active:bg-primary-accent"
              onPress={handleSubmit(onSubmit)}>
              <Text className="text-white text-[16px] text-center font-bold font-target-bold px-7">
                Submit
              </Text>
            </Pressable>
          </View>
          <View>
            <Text className="font-target-medium  text-[15px] mt-4 text-gray-600 text-center">
              We will definitely delete your account in 24 hours.
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 15,
            }}>
            <Text
              style={{
                fontWeight: '900',
                color: '#404040',
                fontSize: 20,
                fontFamily: 'FontsFree-Net-Ritts-Cursive-Regular',
              }}>
              We will miss you .😘
            </Text>
          </View>
        </View>
      </View>
    </Page>
  );
};

export default DeleteAccount;
