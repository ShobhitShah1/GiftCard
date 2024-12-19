import { iNotification } from '@models';
import { AccountApi } from '@services/api/account';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Image, Text, View, AppState, Pressable } from 'react-native';
import { Page, SwipeToDelete } from '../components';
import PushNotification from 'react-native-push-notification';
import { toast } from '@backpackapp-io/react-native-toast';
import Icon from 'react-native-vector-icons/Feather';

const NotificationItem = ({
  item,
  onDelete,
}: {
  item: iNotification;
  onDelete(): void;
}) => {
  return (
    <SwipeToDelete onDelete={onDelete}>
      <View className="flex flex-row bg-white shadow-sm">
        <Image
          source={{
            uri: item.order?.merchant?.image,
          }}
          style={{
            backgroundColor: '#f7f7f7',
            width: 90,
            height: '100%',
            resizeMode: 'contain',
          }}
        />
        <View className="flex-1 flex-col px-3 py-2">
          <Text className="font-target-medium text-sm text-dark">
            {item?.title}
          </Text>
          <Text className="text-gray-400 text-[12px] mt-1">
            {item?.message || '-'}
          </Text>
          <View className="flex flex-row justify-between">
            <Text className="text-gray-500 text-[11px] mt-2">
              {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
            </Text>
            <Pressable
              className="p-1 rounded focus:bg-red-100 ml-1"
              onPress={onDelete}>
              <Icon name="trash" size={14} color={'rgb(204,0,0)'} />
            </Pressable>
          </View>
        </View>
      </View>
    </SwipeToDelete>
  );
};

const NotificationScreen: React.FC = () => {
  const { data, refetch, isLoading, isFetching } =
    AccountApi.useNotificationQuery();

  const [deleteNotif, state] = AccountApi.useDeleteNotifMutation();

  useEffect(() => {
    if (state.data && state.isSuccess) {
      toast.success(state.data.message || '');
    }
  }, [state.data, state.isSuccess]);

  useEffect(() => {
    PushNotification.cancelAllLocalNotifications();
  }, []);
  return (
    <Page
      pageLoader={isLoading || state.isLoading}
      isRefresh={isFetching}
      onRefresh={refetch}>
      <View className={'flex flex-col pb-5 items-center container py-3 mt-5'}>
        <Text className={'font-target-bold font-bold text-[18px] text-dark'}>
          Notification
        </Text>
        <View className="w-full mt-5">
          {data?.data?.map((item, index) => (
            <NotificationItem
              key={`notif-${index}`}
              item={item}
              onDelete={() => deleteNotif({ id: item.id })}
            />
          ))}
        </View>
      </View>
    </Page>
  );
};

export default NotificationScreen;
