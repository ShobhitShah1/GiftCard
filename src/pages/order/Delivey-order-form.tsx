import { InputField, MobileInput } from '@components';
import React from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import * as yup from 'yup';

export const validationDelivery = yup
  .object({
    name: yup.string().required(),
    mobile_number: yup
      .number()
      .typeError('Invalid mobile number format.')
      .required('Invalid mobile number'),
    message: yup.string().required(),
    address: yup.string().required(),
  })
  .required();

type Props = {
  control: Control<FieldValues>;
};

export const DeliveryOrderForm: React.FC<Props> = props => {
  const address = useController({
    control: props.control,
    name: 'address',
  });

  const message = useController({
    control: props.control,
    name: 'message',
  });

  return (
    <View className="py-5 px-[20px]">
      <Text className="font-target-bold text-lg mb-3 text-dark">
        Who are you sending to
      </Text>
      <View>
        <Text className="mb-1 text-sm text-gray-500">Receiver name</Text>
        <InputField
          control={props.control}
          name="name"
          label="Enter name of a person"
          placeholderTextColor={'rgb(75 85 99)'}
        />
      </View>
      <View>
        <Text className="mb-1 text-sm text-gray-500">
          Phone number{' '}
          <Text className="text-[12px] font-semibold text-red-700">
            (Do Not Put 0 Start With 9)
          </Text>
        </Text>
        <MobileInput control={props.control} name="mobile_number" />
      </View>

      <View>
        <Text className="mb-1 text-sm text-gray-500">Delivery address</Text>
        <TextInput
          className={`border h-[80px] ${
            message.formState.errors.message
              ? 'border-red-600'
              : 'border-gray-500'
          } text-gray-900 text-sm focus:ring-gray-500 focus:bg-slate-100 focus:border-gray-500 block w-full p-2.5 `}
          multiline
          numberOfLines={1}
          style={{
            textAlignVertical: 'top',
          }}
          placeholder={'Enter receiver address'}
          value={address.field.value}
          placeholderTextColor={'rgb(75 85 99)'}
          onChangeText={address.field.onChange}
        />
      </View>

      <View>
        <Text className="mb-1 text-sm text-gray-500 " style={{ marginTop: 10 }}>
          Message
        </Text>
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
          onChangeText={message.field.onChange}
        />
      </View>
    </View>
  );
};
