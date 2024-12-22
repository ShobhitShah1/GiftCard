import React from 'react';
import { useRef } from 'react';
import { Text, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { Control, FieldValues, useController } from 'react-hook-form';

type Props = {
  name: string;
  control: Control<FieldValues, { [k in string]: string | number | undefined }>;
};
export const MobileInput: React.FC<Props> = ({ control, name }) => {
  const ref = useRef<PhoneInput | null>();

  const {
    field,
    formState: { errors },
  } = useController({
    control,
    name,
  });

  // const country = useController({
  //   control,
  //   name: 'countryCode',
  //   defaultValue: 'ET',
  // });
  // const phoneCode = useController({
  //   control,
  //   name: 'phoneCode',
  //   defaultValue: '+251',
  // });
  const country = useController({
    control,
    name: 'countryCode',
    defaultValue: 'US',
  });
  const phoneCode = useController({
    control,
    name: 'phoneCode',
    defaultValue: '1',
  });
  return (
    <View className="flex flex-row mb-3">
      <PhoneInput
        ref={r => (ref.current = r)}
        defaultCode={country.field.value}
        value={field.value}
        layout="second"
        codeTextStyle={{
          color: '#909090',
        }}
        onChangeText={text => {
          field.onChange(text);
        }}
        containerStyle={{
          borderWidth: 1.3,
          borderColor: errors[name] ? 'rgb(204, 0, 0)' : 'rgb(136, 136, 136)',
          flex: 1,
          padding: 0,
          maxHeight: 50,
          backgroundColor: '#fff',
        }}
        textInputStyle={{
          fontSize: 16,
          backgroundColor: '#fff',
          height: 40,
        }}
        flagButtonStyle={{
          padding: 0,
          backgroundColor: '#f7f7f7',
        }}
        textContainerStyle={{
          backgroundColor: '#fff',
        }}
        onChangeCountry={e => {
          country.field.onChange(e.cca2);
          phoneCode.field.onChange(e.callingCode[0] || '');
        }}
      />
      {errors[name] && (
        <Text className="bg-red-300 px-2 absolute bottom-0 right-0 rounded-tr-md rounded-bl-md text-[9px] text-white italic">
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
};
