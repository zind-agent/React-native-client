import { Tabs } from 'expo-router';
import HomeIcon from '@/assets/Icons/Home';
import TodoIcon from '@/assets/Icons/Todo';
import ProfileIcon from '@/assets/Icons/Profile';
import ActiveIcon from '@/assets/Icons/ActiveIcon';
import { CustomTabBar } from '@/components/navigation/ButtonNavigation';

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <HomeIcon focused={!focused} />,
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: 'Todos',
          tabBarIcon: ({ focused }) => <TodoIcon focused={!focused} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ focused }) => <ActiveIcon focused={!focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <ProfileIcon focused={!focused} />,
        }}
      />
    </Tabs>
  );
}
