import { InputField } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Merchant } from '@models';
import { OrderApi } from '@services/api';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import * as yup from 'yup';

type Props = Pick<React.ComponentProps<typeof Modal>, 'isVisible'> & {
  onModalHide(visible: boolean): void;
  merchant: Merchant;
  card?: Card;
  fee?: number;
  onSuccess: (agentId: string) => void;
};

export const AgentVerifyModal = React.forwardRef<Modal, Props>(
  ({ onModalHide, ...props }, ref) => {
    return (
      <Modal
        {...props}
        swipeDirection={'down'}
        propagateSwipe={true} // Allow swiping down to close the modal even when the keyboard is open
        avoidKeyboard={true} // Adjust the modal's position to avoid the keyboard
        onSwipeComplete={() => onModalHide(false)}
        style={{
          justifyContent: 'flex-end',
        }}>
        <View
          className={'bg-white px-1 rounded-lg'}
          style={{
            marginHorizontal: -10,
            marginBottom: -10,
          }}>
          <AgentForm {...props} />
        </View>
      </Modal>
    );
  },
);

const validation = yup.object({
  agentId: yup.string().required(),
  pinCode: yup.string().required(),
});

const AgentForm: React.FC<
  Pick<Props, 'merchant' | 'isVisible' | 'card' | 'fee' | 'onSuccess'>
> = props => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(validation),
    defaultValues: {
      merchant_id: props.merchant.id,
    },
  });

  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const deviceToken = useDeviceToken();
  // console.log('fee data ********', props.card?.amount);
  const [verify, agentState] = OrderApi.useAgentVerifyMutation();

  const onSubmit = (value: FieldValues) => {
    console.log('ONSUBMIT AGENT CALL', value);
    verify(value);
    // login({ token: deviceToken || '', ...value }, false);
  };

  useEffect(() => {
    console.log('AGENT STATE', agentState);
    if (agentState.data?.data && agentState.isSuccess) {
      props.onSuccess(agentState.data.data.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentState.data, agentState.isSuccess]);

  const amount = parseFloat((props.card?.amount.amount || 0).toString());
  const total = React.useMemo(() => {
    return amount * ((props.card?.amount?.fee || 0) / 100) + amount;
  }, [amount, props.card?.amount?.fee]);
  return (
    <View className="p-5 pb-10">
      <Text className="text-dark font-target-bold mb-5 text-lg">
        Agent Confirmation
      </Text>
      <View className="flex flex-row justify-between">
        <Text className="text-gray-700">Gift Card</Text>
        <Text className="text-gray-700">
          {props.card?.amount.amount || 0} Birr
        </Text>
      </View>
      <View className="flex flex-row justify-between mt-1">
        <Text className="text-gray-500">Fee ({props.card?.amount?.fee}%)</Text>
        <Text className="text-gray-500">
          {(amount * (props.card?.amount?.fee || 0)) / 100} Birr
        </Text>
      </View>
      <View className="flex flex-row justify-between py-2 border-t border-b border-gray-300 my-3">
        <Text className="font-target-bold text-dark">Total Payment</Text>
        <Text className="font-target-bold text-dark">{total} Birr</Text>
      </View>
      <Text className="text-dark font-target-medium mb-3 text-sm">
        Please enter agent credentials
      </Text>
      {agentState.isError && (
        <View className="bg-red-100 mb-3 border border-red-400 px-4 py-3 rounded relative">
          <Text className="text-red-700">
            {(agentState.error as any)?.message}
          </Text>
        </View>
      )}
      <InputField
        name="agentId"
        control={control}
        label={'Enter Agent ID (A0-XXXXXX)'}
      />
      <Text className="text-gray-500 font-target-medium text-sm">PIN CODE</Text>
      <OTPInputView
        pinCount={6}
        style={{ height: 80, maxWidth: 350 }}
        codeInputFieldStyle={{
          color: '#333',
          borderColor: errors?.pinCode ? '#cc0100' : 'rgba(0,0,0,.5)',
          borderRadius: 8,
          // width: 38,
          // height: 38,
          fontWeight: 'bold',
          fontSize: 20,
        }}
        onCodeChanged={code => {
          console.log(code);
          setValue('pinCode', code);
        }}
        autoFocusOnLoad={false}
      />
      {errors?.pinCode && (
        <Text className="text-red-500 text-[12px]">
          {errors?.pinCode?.message?.toString() || ''}
        </Text>
      )}

      <View className="flex flex-row mt-5">
        <Pressable
          className="bg-primary flex-1 flex h-11 rounded items-center justify-center active:bg-primary-accent"
          onPress={handleSubmit(onSubmit)}>
          <Text className="text-white text-[16px] text-center font-bold font-target-bold">
            CONFIRM ORDER
          </Text>
        </Pressable>
      </View>
      {agentState.isLoading && (
        <View className="absolute flex justify-center top-0 bottom-0 left-0 right-0 bg-gray-900/50">
          <ActivityIndicator color={'#fff'} />
        </View>
      )}
    </View>
  );
};
