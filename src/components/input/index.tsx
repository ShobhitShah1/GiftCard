import React from 'react';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useForm, useController, Control, FieldValues } from 'react-hook-form';
import { Text } from 'react-native';
import type { ViewProps } from 'react-native';

type Props = {
  name: string;
  control: Control<FieldValues, { [k in string]: string | number | undefined }>;
  containerStyle?: ViewProps['style'];
} & React.ComponentProps<typeof FloatingLabelInput>;

export const InputField = React.forwardRef<TextInput, Props>(
  ({ name, control, containerStyle, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const {
      field,
      formState: { errors },
    } = useController({
      control,
      name,
      defaultValue: '',
    });
    return (
      <View
        className={'relative flex flex-row w-full mb-3'}
        style={containerStyle}>
        <FloatingLabelInput
          ref={ref}
          containerStyles={{
            borderRadius: 0,
            borderWidth: errors[name] ? 1.5 : 1.3,
            borderColor: errors[name] ? 'rgb(204, 0, 0)' : 'rgb(136, 136, 136)',
            paddingHorizontal: 10,
            paddingVertical: 8,
            position: 'relative',
            backgroundColor: '#fff',
            ...props.containerStyles,
          }}
          labelStyles={{
            paddingHorizontal: 2,
            backgroundColor: '#fff',
          }}
          customLabelStyles={{
            topFocused: -22,
          }}
          value={field.value}
          onChangeText={field.onChange}
          togglePassword={showPassword}
          disableFullscreenUI
          {...props}
          // onTogglePassword={setShowPassword}
        />
        {errors[name] && (
          <View className="bg-red-300 px-2 absolute bottom-0 right-0 rounded-tr-md rounded-bl-md">
            <Text className="text-[9px] text-white italic">
              {errors[name]?.message as string}
            </Text>
          </View>
        )}
      </View>
    );
  },
);
