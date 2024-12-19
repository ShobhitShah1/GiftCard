import React from 'react';
import { BerlinTabBarNavigator, DotSize } from 'rn-slick-bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

const Tabs = BerlinTabBarNavigator();

const TabBarIcon = (props: any) => {
  return (
    <Icon
      name={props.name}
      size={props.size ? props.size : 24}
      color={props.tintColor}
    />
  );
};

// const BottomTabs = () => (
//   <Tabs.Navigator
//     backBehavior="history"
//     screenOptions={{
//       animation: 'slide_from_right',
//     }}
//     initialRouteName="TabOne"
//     tabBarOptions={{
//       labelStyle: { fontSize: 12, marginTop: 5, fontWeight: 'bold' },
//       activeTintColor: '#7A28CB',
//       inactiveTintColor: '#9e9e9e',
//       activeBackgroundColor: '#e5cfff',
//       activeTabColor: '#7A28CB',
//     }}
//     appearance={{ dotSize: DotSize.MEDIUM }}>
//     <Tabs.Screen
//       name="TabOne"
//       component={}
//       options={{
//         tabBarIcon: ({ focused, color }: any) => (
//           <TabBarIcon focused={focused} tintColor={color} name="home-sharp" />
//         ),
//       }}
//     />
//   </Tabs.Navigator>
// );
