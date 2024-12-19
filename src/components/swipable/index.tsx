import React, { PropsWithChildren } from 'react';
import { Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import { Swipeable, TouchableOpacity } from 'react-native-gesture-handler';

const renderRightActions = (
  progress: Animated.AnimatedInterpolation<string | number>,
  dragX: Animated.AnimatedInterpolation<string | number>,
  onDelete: () => void,
) => {
  const opacity = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.swipedRow}>
      <View style={styles.swipedConfirmationContainer}>
        <Text style={styles.deleteConfirmationText}>Are you sure?</Text>
      </View>
      <Animated.View style={[styles.deleteButton, { opacity }]}>
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
export const SwipeToDelete: React.FC<
  PropsWithChildren & { onDelete(): void }
> = props => {
  const repp = React.useRef<Swipeable>(null);
  const closeSwiper = () => {
    repp.current?.close();
  };
  return (
    <Swipeable
      ref={repp}
      containerStyle={{ borderColor: '#eee', borderTopWidth: 1 }}
      renderRightActions={(pv, dg) =>
        renderRightActions(pv, dg, () => {
          closeSwiper();
          props.onDelete();
        })
      }>
      {props.children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingLeft: 5,
    backgroundColor: '#efefef',
    margin: 20,
    minHeight: 50,
  },
  swipedRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingLeft: 5,
    backgroundColor: '#818181',
    // margin: 20,
    minHeight: 50,
  },
  swipedConfirmationContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  deleteConfirmationText: {
    color: '#fcfcfc',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#b60000',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  deleteButtonText: {
    color: '#fcfcfc',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});
