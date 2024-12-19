import { iNotification } from '@models';
import { AccountApi } from '@services/api/account';
import moment from 'moment';
import React, { useEffect } from 'react';
import {
  Image,
  Text,
  View,
  AppState,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { InputField, Page, SwipeToDelete } from '../components';
import { toast } from '@backpackapp-io/react-native-toast';
import { FieldValues, useController, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ContactApi } from '@services/api/contact';
const validation = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  message: yup.string().required(),
});

const ContactUs: React.FC = () => {
  const [send, { isLoading, data, isSuccess }] = ContactApi.useSendMutation();
  const { control, formState, handleSubmit, reset } = useForm({
    resolver: yupResolver(validation),
  });
  const message = useController({
    control: control,
    name: 'message',
  });
  const onSubmit = (value: FieldValues) => {
    send(value);
  };

  useEffect(() => {
    if (isSuccess && data?.message) {
      toast.success(data.message || '');
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data]);

  return (
    <Page pageLoader={isLoading}>
      <View
        className={
          'flex flex-col pb-5 bg-white h-full items-center container py-3 mt-3'
        }>
        {/* {Platform.OS === 'ios' && (
          <Text className={'font-target-bold font-bold text-[18px] text-dark text-center'}>
            Have a question or you want to delete your account??
          </Text>
        )} */}
        <Text className={'font-target-bold font-bold text-[18px] text-dark text-center'}>
        Have a question or you want to delete your account?
        </Text>
        <View className="w-full mt-5 px-5 ">
          <View>
            <Text className="mb-1 text-sm text-gray-500">Name</Text>
            <InputField control={control} name="name" label="Enter your name" />
          </View>
          <View>
            <Text className="mb-1 text-sm text-gray-500">Email address</Text>
            <InputField
              control={control}
              name="email"
              label="Enter email address"
            />
          </View>
          <View>
            <Text className="mb-1 text-sm text-gray-500">Message</Text>
            <TextInput
              className={`border h-[80px] ${
                formState.errors.message ? 'border-red-600' : 'border-gray-500'
              } text-gray-900 text-sm focus:ring-gray-500 focus:bg-slate-100 focus:border-gray-500 block w-full p-2.5 `}
              multiline
              numberOfLines={3}
              style={{
                textAlignVertical: 'top',
              }}
              placeholder={'Enter your message'}
              value={message.field.value}
              onChangeText={message.field.onChange}
            />
          </View>
          <View className="flex flex-row">
            <Pressable
              className="text-white mt-5 bg-red-700 active:bg-red-800 active:outline-none active:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              onPress={handleSubmit(onSubmit)}>
              <Text className="text-white font-target-medium">SUBMIT</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Page>
  );
};

export default ContactUs;
