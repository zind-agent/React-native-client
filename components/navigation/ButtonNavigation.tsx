import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View } from '../Themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from '../ui/pressable';
import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const animatedValues = useRef(
    state.routes.map((_, i) => new Animated.Value(state.index === i ? 1 : 0))
  ).current;

  useEffect(() => {
    animatedValues.forEach((val, i) => {
      Animated.timing(val, {
        toValue: state.index === i ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
  }, [state.index]);

  return (
    <View
      className='absolute flex-row justify-between mb-3 rounded-xl h-[70px] p-1 left-0 right-0 bg-white mx-4'
      style={{
        bottom: insets.bottom + 10,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 1.84,
        elevation: 2,
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
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          >

            {IconComponent?.({
              focused: isFocused,
              color: animatedColor as any,
              size: 24,
            })}
          </Pressable>
        );
      })}
    </View>
  );
};
