import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from '../ui/pressable';
import { Colors } from '@/constants/Colors';
import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { MotiView, motify } from 'moti';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import AddButton from '@/components/shared/addButton';

const MotiPressable = motify(Pressable)();

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const { width } = Dimensions.get('window');
  const buttonSize = 64;

  return (
    <MotiView
      className="absolute flex-row justify-between mb-3 rounded-t-2xl rounded-b-md h-[57px] left-0 right-0 mx-4"
      style={{
        bottom: insets.bottom,
        backgroundColor: Colors.main.border,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: -buttonSize / 1.7,
          left: width / 1 - buttonSize / 1 - 45,
          zIndex: 10,
        }}
      >
        <AddButton />
      </View>

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        if (route.name === 'addTodoAi' || route.name === 'addTodo') return null;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        const IconComponent = options.tabBarIcon;
        const animatedColor = useSharedValue(isFocused ? Colors.main.primary : Colors.main.primaryLight);
        const colorString = useDerivedValue(() => animatedColor.value);

        useEffect(() => {
          animatedColor.value = withTiming(isFocused ? Colors.main.primary : Colors.main.primaryLight, {
            duration: 250,
          });
        }, [isFocused, animatedColor]);

        return (
          <MotiPressable key={route.key} onPress={onPress} style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            {IconComponent?.({
              focused: isFocused,
              color: colorString.value,
              size: 24,
            })}
          </MotiPressable>
        );
      })}
    </MotiView>
  );
};
