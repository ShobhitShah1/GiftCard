import { Page, SwipeToDelete } from '@components';
import { iOrder } from '@models';
import { OrderApi } from '@services/api';
import React, { useEffect } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
import { toast } from '@backpackapp-io/react-native-toast';

const OrderItem: React.FC<{
  item: iOrder;
  onDelete(paymentId: string): void;
}> = ({ item, onDelete }) => {
  console.log("item **********",item)
  return (
    <SwipeToDelete onDelete={() => onDelete(item.payment_id)}>
      <View className="flex flex-row bg-white px-2 shadow-sm">
        <View className="flex-1 flex-col px-3 py-2">
          <View className="flex flex-row flex-wrap">
            <Text className="font-target-medium text-sm">
              #{item.payment_id}
            </Text>
            <Pressable
              className="p-1 rounded focus:bg-red-100 ml-1"
              onPress={() => onDelete(item.payment_id)}>
              <Icon name="trash" size={14} color={'rgb(204,0,0)'} />
            </Pressable>
          </View>

          <View className="flex flex-row mt-2 mb-1">
            <Text className="font-normal text-[12px] text-gray-500 w-[70px]">
              Send to
            </Text>
            <Text className="text-gray-500">:</Text>
            <Text className="text-gray-600 font-target-medium text-[12px] ml-1">
              {item.name}
            </Text>
          </View>
          {/* <View className="flex flex-1 flex-row mb-1 overflow-hidden">
            <Text className="font-normal text-[12px] text-gray-500 w-[70px]">
              Email
            </Text>
            <Text className="text-gray-500">:</Text>
            <Text
              numberOfLines={1}
              className="text-gray-600 flex-1 font-target-medium text-[12px] ml-1">
              {item.email}
            </Text>
          </View> */}
          <View className="flex flex-row mb-1">
            <Text className="font-normal text-[12px] text-gray-500 w-[70px]">
              Date
            </Text>
            <Text className="text-gray-500">:</Text>
            <Text className="text-gray-600 font-target-medium text-[12px] ml-1">
              {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
            </Text>
          </View>
          <View className="flex flex-row mb-1">
            <Text className="font-normal text-[12px] text-gray-500 w-[70px]">
              Message
            </Text>
            <Text className="text-gray-500">:</Text>
            <Text
              className="text-gray-600 flex-1 text-gray-600 text-[12px] ml-1"
              style={{ maxWidth: 150 }}
              numberOfLines={2}>
              {item.message}
            </Text>
          </View>
        </View>
        <View className="flex items-center py-2">
          <Image
            source={{
              uri: item.merchant.image,
            }}
            style={{
              width: 110,
              aspectRatio: 4 / 3,
              resizeMode: 'cover',
              borderRadius: 10,
            }}
          />
          <Text className="text-gray-600 font-target-medium text-[10px]">
            {item.merchant.name}
          </Text>
          <Text className="text-gray-600 font-target-medium text-[10px]">
            {item.amount} Birr
          </Text>
          {item.deliver_order.toString() === '1' ? (
            <>
              {item.delivery_status.toString() === '1' && (
                <Text className="bg-green-50 text-green-700 font-target-medium text-[10px] rounded border-red-400 px-2 py-1 ml-1">
                  Delivered
                </Text>
              )}
            </>
          ) : (
            <>
              {item.status.toString() === '1' && (
                <Text className="bg-green-50 text-green-700 font-target-medium text-[10px] rounded border-red-400 px-2 py-1 ml-1">
                  Success
                </Text>
              )}
            </>
          )}
          {item.deliver_order.toString() === '1' ? (
            <>
              {item.delivery_status.toString() === '0' && (
                <Text className="bg-orange-50 text-orange-700 font-target-medium text-[10px] rounded border-red-400 px-2 py-1 ml-1">
                  In Process
                </Text>
              )}
            </>
          ) : (
            <>
              {item.status.toString() === '0' && (
                <Text className="bg-orange-50 text-orange-700 font-target-medium text-[10px] rounded border-red-400 px-2 py-1 ml-1">
                  Pending
                </Text>
              )}
            </>
          )}

          {item.status.toString() === '-1' && (
            <Text className="bg-red-50 text-red-500 font-target-medium text-[10px] rounded border-red-400 px-2 py-1 ml-1">
              Cancelled
            </Text>
          )}
        </View>
      </View>
    </SwipeToDelete>
  );
};

const HistorySreen: React.FC = () => {
  const { data, isLoading, isFetching, refetch } = OrderApi.useHistoryQuery();
  const [deleteHistory, state] = OrderApi.useDeleteMutation();

  useEffect(() => {
    console.log('data **************************', data);
    if (state.isSuccess && state.data) {
      toast.success(state?.data?.message || '');
    }
  }, [state]);
  return (
    <Page
      pageLoader={isLoading || state.isLoading}
      onRefresh={refetch}
      isRefresh={isLoading}>
      <View
        className={
          'flex flex-1 flex-col h-full pb-[100px] items-center container pt-3 mt-5'
        }>
        <Text className={'font-target-bold font-bold text-[18px] text-dark'}>
          Order History
        </Text>
        <View className="w-full mt-5 flex-1">
          {data?.data?.map((order, index) => (
            <OrderItem
              key={`order-${index}-${order.payment_id}`}
              item={order}
              onDelete={pId => deleteHistory({ id: pId })}
            />
          ))}
          {Array.isArray(data?.data) && (data?.data?.length || 0) <= 0 && (
            <Text className="text-center mt-6 text-gray-400 text-target-medium">
              No order found
            </Text>
          )}
          {/* <NotificationItem />
          <NotificationItem /> */}
        </View>
      </View>
    </Page>
  );
};

export default HistorySreen;
