import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from '../ui/pressable';
import { Colors } from '@/constants/Colors';
import React, { useCallback, useMemo } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { MotiView, motify } from 'moti';
import { interpolateColor, useSharedValue, withTiming } from 'react-native-reanimated';
import AddButton from '../common/addButton';

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

type TabBarIcon = React.ComponentType<TabBarIconProps>;

const MotiPressable = motify(Pressable)();

const BUTTON_SIZE = 64;
const ANIMATION_DURATION = 150;
const TAB_HEIGHT = 57;
const HORIZONTAL_MARGIN = 16;

const TabButton = React.memo<{
  route: any;
  index: number;
  isFocused: boolean;
  onPress: () => void;
  IconComponent?: TabBarIcon;
}>(({ route, isFocused, onPress, IconComponent }) => {
  const animatedValue = useSharedValue(isFocused ? 1 : 0);

  React.useEffect(() => {
    animatedValue.value = withTiming(isFocused ? 1 : 0, {
      duration: ANIMATION_DURATION,
    });
  }, [isFocused, animatedValue]);

  const animatedStyle = useMemo(
    () => ({
      color: interpolateColor(animatedValue.value, [0, 1], [Colors.main.primaryLight, Colors.main.primary]),
    }),
    [animatedValue],
  );

  return (
    <MotiPressable key={route.key} onPress={onPress} style={styles.tabButton} animate={{ scale: isFocused ? 1.1 : 1 }} transition={{ type: 'timing', duration: ANIMATION_DURATION }}>
      {IconComponent && <IconComponent focused={isFocused} color={animatedStyle.color} size={24} />}
    </MotiPressable>
  );
});

TabButton.displayName = 'TabButton';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const screenWidth = useMemo(() => Dimensions.get('window').width, []);
  const visibleRoutes = useMemo(
    () => state.routes.filter((route) => route.name !== 'addTodoAi' && route.name !== 'createTask' && route.name !== '[taskId]' && route.name !== 'edit/[editTaskId]'),
    [state.routes],
  );
  const hideTabBar = useMemo(
    () => state.routes[state.index].name === '[taskId]' || state.routes[state.index].name === 'createTask' || state.routes[state.index].name === 'edit/[editTaskId]',
    [state.routes, state.index],
  );

  const handleTabPress = useCallback(
    (routeName: string, isFocused: boolean) => {
      if (!isFocused) {
        navigation.navigate(routeName);
      }
    },
    [navigation],
  );

  const addButtonPosition = useMemo(
    () => ({
      position: 'absolute' as const,
      top: -BUTTON_SIZE / 1.5,
      left: screenWidth - BUTTON_SIZE - 45,
      zIndex: 10,
    }),
    [screenWidth],
  );

  const containerStyle = useMemo(
    () => ({
      bottom: insets.bottom,
      backgroundColor: Colors.main.border,
    }),
    [insets.bottom],
  );

  return (
    <MotiView
      style={[styles.container, containerStyle, { display: hideTabBar ? 'none' : 'flex' }]}
      animate={{ translateY: 0 }}
      from={{ translateY: 100 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      <View style={addButtonPosition}>
        <AddButton />
      </View>

      {visibleRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === state.routes.indexOf(route);
        const IconComponent = options.tabBarIcon;

        return <TabButton key={route.key} route={route} index={index} isFocused={isFocused} onPress={() => handleTabPress(route.name, isFocused)} IconComponent={IconComponent} />;
      })}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderRadius: 14,
    height: TAB_HEIGHT,
    left: 0,
    right: 0,
    marginHorizontal: HORIZONTAL_MARGIN,
  },
  tabButton: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flex: 1,
  },
});
