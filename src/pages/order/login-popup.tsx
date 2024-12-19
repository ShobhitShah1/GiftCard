import React from 'react';
import BottomSheet, {
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import { View, Text, Pressable } from 'react-native';
import { FieldValues, useForm } from 'react-hook-form';
import { InputField } from '@components';

export const LoginPopoup = React.forwardRef<BottomSheet>((props, ref) => {
  const initialSnapPoints = React.useMemo(() => [1, 'CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });
  return (
    <BottomSheet
      ref={ref}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      animationConfigs={animationConfigs}
      enablePanDownToClose={true}
      bottomInset={10}
      // enableContentPanningGesture
      // enableHandlePanningGesture
      enableOverDrag
      onClose={() => {
        console.log('modal closed.');
      }}
      style={{
        zIndex: 9999,
      }}>
      <BottomSheetView
        className="bg-white pb-5 z-1"
        onLayout={handleContentLayout}>
        <LoginForm />
      </BottomSheetView>
    </BottomSheet>
  );
});

const LoginForm = () => {
  const { control, handleSubmit } = useForm();
  const onSubmit = (value: FieldValues) => {
    console.log(value);
  };
  return (
    <View className="p-5 pb-20">
      <InputField
        name="identifier"
        control={control}
        label={'Enter username or email'}
      />
      <InputField
        name="password"
        control={control}
        label={'Enter Password'}
        isPassword
        customShowPasswordComponent={<Text className="text-sm">Show</Text>}
        customHidePasswordComponent={<Text className="text-sm">Hide</Text>}
      />

      <View className="flex flex-row mt-5">
        <Pressable
          className="bg-primary flex-1 flex h-11 rounded items-center justify-center active:bg-primary-accent"
          onPress={handleSubmit(onSubmit)}>
          <Text className="text-white text-[16px] text-center font-bold font-target-bold">
            Sign In
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
