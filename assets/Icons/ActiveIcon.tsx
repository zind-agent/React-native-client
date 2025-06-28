import { Colors } from '@/constants/Colors';
import { Svg, Path } from 'react-native-svg';
import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';

interface ActiveIconProps {
  focused: boolean;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ActiveIcon = ({ focused }: ActiveIconProps) => {
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
        d="M20.7414 8.13212C20.8817 9.07603 20.946 10.1391 20.946 11.3319C20.946 18.6491 18.5077 21.0874 11.1905 21.0874C3.87443 21.0874 1.43503 18.6491 1.43503 11.3319C1.43503 4.01583 3.87443 1.57643 11.1905 1.57643C12.3612 1.57643 13.4063 1.63865 14.3365 1.77364"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.58197"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.14697 14.0231L9.30353 9.92155L12.9041 12.748L15.9932 8.76144"
        stroke={Colors.light.light}
        strokeWidth="1.58197"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M19.5938 0.834955C20.7138 0.834955 21.6208 1.74195 21.6208 2.86199C21.6208 3.98097 20.7138 4.88902 19.5938 4.88902C18.4738 4.88902 17.5668 3.98097 17.5668 2.86199C17.5668 1.74195 18.4738 0.834955 19.5938 0.834955Z"
        stroke={Colors.light.light}
        strokeWidth="1.58197"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ActiveIcon;
