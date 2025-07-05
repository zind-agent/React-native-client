import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

export const LogoIcons = () => (
  <Svg width="200" height="200" viewBox="0 0 200 200">
    <Defs>
      <LinearGradient id="lifeGradient" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#5C6BC0" />
        <Stop offset="100%" stopColor="#C6CEDD" />
      </LinearGradient>
    </Defs>

    <Circle cx="50" cy="50" r="20" fill="url(#lifeGradient)" />
    <Circle cx="100" cy="50" r="20" fill="url(#lifeGradient)" />
    <Circle cx="150" cy="50" r="20" fill="url(#lifeGradient)" />

    <Path d="M30 130 Q 50 90 70 130 T 110 130 T 150 130" fill="none" stroke="url(#lifeGradient)" strokeWidth="12" strokeLinecap="round" />

    <Path d="M100 130 L100 80" stroke="url(#lifeGradient)" strokeWidth="8" strokeLinecap="round" />
  </Svg>
);
