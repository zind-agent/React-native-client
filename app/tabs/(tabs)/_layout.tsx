import React from 'react';
import Profile from './profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from '@/components/navigation/ButtonNavigation';
import HomeIcon from '@/assets/Icons/Home';
import TodoIcon from '@/assets/Icons/Todo';
import Todos from './todos';
import ProfileIcon from '@/assets/Icons/Profile';
import ActiveIcon from '@/assets/Icons/ActiveIcon';
import Activity from './activity';
import Home from '.';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => <HomeIcon focused={!focused} />,
        }}
      />

      <Tab.Screen
        name="Todos"
        component={Todos}
        options={{
          tabBarIcon: ({ focused }) => <TodoIcon focused={!focused} />,
        }}
      />

      <Tab.Screen
        name="Activity"
        component={Activity}
        options={{
          tabBarIcon: ({ focused }) => <ActiveIcon focused={!focused} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => <ProfileIcon focused={!focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
