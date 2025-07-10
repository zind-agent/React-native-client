import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from '../ui/pressable';
import { Colors } from '@/constants/Colors';
import React, { useEffect } from 'react';
import { Platform, View, Dimensions } from 'react-native';
import { MotiView, useDynamicAnimation, motify } from 'moti';
import { useAppStore } from '@/store/appState';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import AddButton from '@/components/shared/addButton';

const MotiPressable = motify(Pressable)();

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { hideTabBar, setAddInTimeTodoDrawer } = useAppStore();

  const tabBarAnimation = useDynamicAnimation(() => ({
    translateY: 0,
    opacity: 1,
  }));

  useEffect(() => {
    tabBarAnimation.animateTo({
      translateY: hideTabBar ? 100 : 0,
      opacity: hideTabBar ? 0 : 1,
      transition: {
        type: 'timing',
        duration: 250,
      },
    });
  }, [hideTabBar]);

  const { width } = Dimensions.get('window');
  const buttonSize = 64;

  return (
    <MotiView
      state={tabBarAnimation}
      className="absolute flex-row justify-between mb-3 rounded-xl h-[77px] left-0 right-0 mx-4"
      style={{
        bottom: insets.bottom,
        backgroundColor: Colors.light.card,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
          android: { elevation: 1 },
        }),
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

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        const IconComponent = options.tabBarIcon;
        const animatedColor = useSharedValue(isFocused ? Colors.light.primary : Colors.light.light);
        const colorString = useDerivedValue(() => animatedColor.value);

        useEffect(() => {
          animatedColor.value = withTiming(isFocused ? Colors.light.primary : Colors.light.light, {
            duration: 450,
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
