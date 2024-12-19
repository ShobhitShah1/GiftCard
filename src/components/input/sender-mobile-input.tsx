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

export const SenderMobileInput: React.FC<Props> = ({
  control,
  name,
  containerStyle,
  StoreCountryCode,
  ...props
}) => {
  const {
    field,
    formState: { errors },
  } = useController({
    control,
    name,
  });

  const sender_country = useController({
    control,
    name: 'sender_countryCode',
    defaultValue: 'ET',
  });
  const sender_phoneCode = useController({
    control,
    name: 'sender_phoneCode',
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
          countryCode={sender_country.field.value}
          onSelect={e => {
            sender_country.field.onChange(e.cca2);
            sender_phoneCode.field.onChange(e.callingCode[0] || '');
            StoreCountryCode && StoreCountryCode(e.callingCode[0]);
          }}
          withCallingCode
          withCallingCodeButton
          withCloseButton
          preferredCountries={['US', 'ET']}
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

// import React from 'react';
// import { useRef } from 'react';
// import { Text, View } from 'react-native';
// import PhoneInput from 'react-native-phone-number-input';
// import { Control, FieldValues, useController } from 'react-hook-form';

// type Props = {
//   name: string;
//   control: Control<FieldValues, { [k in string]: string | number | undefined }>;
// };
// export const SenderMobileInput: React.FC<Props> = ({ control, name }) => {
//   const ref = useRef<PhoneInput | null>();

//   const {
//     field,
//     formState: { errors },
//   } = useController({
//     control,
//     name,
//   });

//   const sender_country = useController({
//     control,
//     name: 'sender_countryCode',
//     defaultValue: 'US',
//   });
//   const sender_phoneCode = useController({
//     control,
//     name: 'sender_phoneCode',
//     defaultValue: '1',
//   });

//   console.log('Sender Mobile Input:', field);

//   return (
//     <View className="flex flex-row mb-3">
//       <PhoneInput
//         ref={r => (ref.current = r)}
//         defaultCode={sender_country.field.value}
//         value={field.value}
//         layout="second"
//         codeTextStyle={{
//           color: '#909090',
//         }}
//         onChangeText={text => {
//           field.onChange(text);
//         }}
//         onChangeFormattedText={text => {
//           console.log('a', text);
//         }}
//         containerStyle={{
//           borderWidth: 1.3,
//           borderColor: errors[name] ? 'rgb(204, 0, 0)' : 'rgb(136, 136, 136)',
//           flex: 1,
//           padding: 0,
//           maxHeight: 50,
//           backgroundColor: '#fff',
//         }}
//         textInputStyle={{
//           fontSize: 16,
//           backgroundColor: '#fff',
//           height: 40,
//         }}
//         flagButtonStyle={{
//           padding: 0,
//           backgroundColor: '#f7f7f7',
//         }}
//         textContainerStyle={{
//           backgroundColor: '#fff',
//         }}
//         onChangeCountry={e => {
//           sender_country.field.onChange(e.cca2);
//           sender_phoneCode.field.onChange(e.callingCode[0] || '');
//         }}
//       />
//       {errors[name] && (
//         <Text className="bg-red-300 px-2 absolute bottom-0 right-0 rounded-tr-md rounded-bl-md text-[9px] text-white italic">
//           {errors[name]?.message?.toString()}
//         </Text>
//       )}
//     </View>
//   );
// };
