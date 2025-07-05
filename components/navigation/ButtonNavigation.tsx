import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from '../ui/pressable';
import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import { useAppStore } from '@/store/appState';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { hideTabBar } = useAppStore();

  const animatedTranslate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedTranslate, {
      toValue: hideTabBar ? 100 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [hideTabBar]);

  const animatedValues = useRef(state.routes.map((_, i) => new Animated.Value(state.index === i ? 1 : 0))).current;

  useEffect(() => {
    animatedValues.forEach((val, i) => {
      Animated.timing(val, {
        toValue: state.index === i ? 1 : 0,
        duration: 450,
        useNativeDriver: false,
      }).start();
    });
  }, [state.index]);

  return (
    <Animated.View
      className="absolute flex-row justify-between mb-3 rounded-xl h-[77px] left-0 right-0 mx-4"
      style={{
        bottom: insets.bottom + 0,
        backgroundColor: Colors.light.card,
        transform: [{ translateY: animatedTranslate }],

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
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        const IconComponent = options.tabBarIcon;

        const animatedColor = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [Colors.light.light, Colors.light.primary],
        });

        return (
          <Pressable key={route.key} onPress={onPress} style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            {IconComponent?.({
              focused: isFocused,
              color: animatedColor as any,
              size: 24,
            })}
          </Pressable>
        );
      })}
    </Animated.View>
  );
};
