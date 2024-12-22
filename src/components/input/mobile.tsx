import React from 'react';
import type { ViewProps } from 'react-native';
import { TextInput, View } from 'react-native';
import CountryPicker, {
  CountryModalProvider,
} from 'react-native-country-picker-modal';

import { Control, FieldValues, useController } from 'react-hook-form';

type Props = {
  name: string;
  control: Control<FieldValues, { [k in string]: string | number | undefined }>;
  containerStyle?: ViewProps['style'];
  StoreCountryCode?: (code: string) => void;
} & React.ComponentProps<typeof TextInput>;

export const MobileInput: React.FC<Props> = ({
  control,
  name,
  containerStyle,
  ...props
}) => {
  const {
    field,
    formState: { errors },
  } = useController({
    control,
    name,
  });

  const country = useController({
    control,
    name: 'countryCode',
    defaultValue: 'ET',
  });
  const phoneCode = useController({
    control,
    name: 'phoneCode',
    defaultValue: '+251',
  });

  return (
    <CountryModalProvider>
      <View
        className={`relative flex h-[48px] flex-row w-full mb-3 border ${
          errors[name] ? 'border-primary' : 'border-gray-600'
        }`}
        style={containerStyle}>
        <CountryPicker
          withModal
          countryCode={country.field.value}
          onSelect={e => {
            country.field.onChange(e.cca2);
            phoneCode.field.onChange(e.callingCode[0] || '');
          }}
          withCallingCode
          withCallingCodeButton
          withCloseButton
          preferredCountries={['ET', 'US']}
          containerButtonStyle={{
            backgroundColor: '#eee',
            height: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 5,
          }}
        />
        <TextInput
          className={'flex-1 h-[48px] bg-transparent px-30'}
          keyboardType="number-pad"
          placeholder="Enter mobile number"
          style={{
            paddingHorizontal: 10,
            color: '#333',
          }}
          onChangeText={text => {
            field.onChange(text);
          }}
          value={field.value}
        />
      </View>
    </CountryModalProvider>
  );
};
