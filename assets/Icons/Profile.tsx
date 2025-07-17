import { Colors } from '@/constants/Colors';
import { Svg, Path } from 'react-native-svg';
import { Animated } from 'react-native';
import { getAnimatedColors, useIconAnimation } from '@/components/animationIcons';

interface ProfileIconProps {
  focused: boolean;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ProfileIcon = ({ focused }: ProfileIconProps) => {
  const animation = useIconAnimation(focused);

  const fillColor = getAnimatedColors(animation, Colors.main.primary, 'transparent');
  const strokeColor = getAnimatedColors(animation, 'transparent', Colors.main.primaryLight);

  return (
    <Svg width="27" height="27" viewBox="0 0 24 24" fill="none">
      <AnimatedPath
        d="M1.65201 7.27018C1.65201 4.68039 2.97771 2.45624 5.49336 1.9401C8.00795 1.42295 9.91908 1.60173 11.5067 2.45826C13.0955 3.31479 12.6405 4.57938 14.2727 5.50763C15.9059 6.43688 18.533 5.04098 20.2489 6.89242C22.0455 8.83072 22.036 11.8064 22.036 13.7032C22.036 20.911 17.9984 21.4827 11.844 21.4827C5.68956 21.4827 1.65201 20.9837 1.65201 13.7032V7.27018Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.58197"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path stroke={Colors.main.primaryLight} d="M6.74841 14.4559H16.9224" strokeWidth="1.58197" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default ProfileIcon;
