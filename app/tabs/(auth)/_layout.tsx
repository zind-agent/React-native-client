import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthWithEmail from './email';
import AuthWithPhoneNumber from '.';

const Tab = createNativeStackNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="AuthWithPhoneNumber" component={AuthWithPhoneNumber} />

      <Tab.Screen name="AuthWithEmail" component={AuthWithEmail} />
    </Tab.Navigator>
  );
}
