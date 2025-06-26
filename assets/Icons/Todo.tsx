import { Colors } from '@/constants/Colors';
import { Svg, Path } from 'react-native-svg';
import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

interface TodoIconProps {
  focused: boolean;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const TodoIcon = ({ focused }: TodoIconProps) => {
  const animation = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: focused ? 1 : 0,
      duration: 100,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const fillColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.light.primary, Colors.light.surface],
  });

  const strokeColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', Colors.light.light],
  });

  return (
    <Svg width="27" height="27" viewBox="0 0 24 24" fill="none">
      <AnimatedPath
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.127014 10.1069C0.127014 17.464 2.35207 19.9171 9.02618 19.9171C15.7014 19.9171 17.9254 17.464 17.9254 10.1069C17.9254 2.74976 15.7014 0.296685 9.02618 0.296685C2.35207 0.296685 0.127014 2.74976 0.127014 10.1069Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.58197"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M12.837 14.027H5.17972"
        stroke={Colors.light.light}
        strokeWidth="1.58197"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M12.837 10.0372H5.17972"
        stroke={Colors.light.light}
        strokeWidth="1.58197"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M8.10156 6.05273H5.17972"
        stroke={Colors.light.light}
        strokeWidth="1.58197"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default TodoIcon;
