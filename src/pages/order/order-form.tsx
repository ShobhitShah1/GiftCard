import { InputField, MobileInput } from '@components';
import { SenderMobileInput } from '@components/input/sender-mobile-input';
import React, { useEffect } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import * as yup from 'yup';

export const validation = yup
  .object({
    name: yup.string().required(),
    // email: yup.string().email().required(),
    mobile_number: yup
      .number()
      .typeError('Invalid mobile number format.')
      .required('Invalid mobile number'),
    message: yup.string().required(),
    cardId: yup.string().required('Please select amount.'),

    // payment_method: yup.string().required('Please select payment method.'),
  })
  .required();

export const OfflineModeValidation = yup
  .object({
    name: yup.string().required(),
    // email: yup.string().email().required(),
    mobile_number: yup
      .number()
      .typeError('Invalid mobile number format.')
      .required('Invalid mobile number'),
    message: yup.string().required(),
    cardId: yup.string().required('Please select amount.'),
    sender_name: yup.string().required(),
    sender_number: yup
      .number()
      .typeError('Invalid mobile number format.')
      .required('Invalid mobile number'),

    // payment_method: yup.string().required('Please select payment method.'),
  })
  .required();

type Props = {
  control: Control<FieldValues>;
  MODE: string;
};

export const OrderForm: React.FC<Props> = props => {
  const message = useController({
    control: props.control,
    name: 'message',
  });

  // const senderName = useController({
  //   control: props.control,
  //   name: 'sender_name',
  // });

  // const sender_country_code = useController({
  //   control: props.control,
  //   name: 'sender_country_code',
  // });

  return (
    <View className="py-5 px-[20px]">
      <Text className="font-target-bold text-lg mb-3 text-dark">
        Who are you sending to
      </Text>

      {props?.MODE === 'offline' && (
        <View>
          <Text className="mb-1 text-sm text-gray-500">Sender Name</Text>
          <InputField
            control={props.control}
            name="sender_name"
            label="Enter name of a sender"
            placeholderTextColor={'rgb(75 85 99)'}
          />
        </View>
      )}

      {props?.MODE === 'offline' && (
        <View>
          <Text className="mb-1 text-sm text-gray-500">
            Sender Phone Number{' '}
            <Text className="text-[12px] font-semibold text-red-700">
              (Do Not Put 0 Start With 9)
            </Text>
          </Text>
          <SenderMobileInput control={props.control} name="sender_number" />
        </View>
      )}

      <View>
        <Text className="mb-1 text-sm text-gray-500">Recipient’s Name</Text>
        <InputField
          control={props.control}
          name="name"
          label="Enter name of a person"
          placeholderTextColor={'rgb(75 85 99)'}
        />
      </View>

      {/* <View>
        <Text className="mb-1 text-sm text-gray-500">Person's Email</Text>
        <InputField
          control={props.control}
          name="email"
          label="Enter person's email"
        />
      </View> */}
      <View>
        <Text className="mb-1 text-sm text-gray-500">
          Recipient’s Phone Number{' '}
          <Text className="text-[12px] font-semibold text-red-700">
            (Do Not Put 0 Start With 9)
          </Text>
        </Text>
        <MobileInput
          control={props.control}
          name="mobile_number"
          placeholderTextColor={'rgb(75 85 99)'}
        />
      </View>

      <View>
        <Text className="mb-1 text-sm text-gray-500 ">Message</Text>
        <TextInput
          className={`border h-[80px] ${
            message.formState.errors.message
              ? 'border-red-600'
              : 'border-gray-500'
          } text-gray-900 text-sm focus:ring-gray-500 focus:bg-slate-100 focus:border-gray-500 block w-full p-2.5 `}
          multiline
          numberOfLines={3}
          style={{
            textAlignVertical: 'top',
          }}
          placeholder={'Your message : - Exa.. I Love You, Congratulations '}
          value={message.field.value}
          placeholderTextColor={'rgb(75 85 99)'}
          onChangeText={message.field.onChange}
        />
      </View>
    </View>
  );
};
