import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const CancelIcon = () => {
  return (
    <Svg width="40" height="40" viewBox="0 0 30 30" fill="none">
      <Path d="M8.5 8.5L21.5 21.5M21.5 8.5L8.5 21.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <Path
        d="M3.5 15C3.5 23.5 6.5 26.5 15 26.5C23.5 26.5 26.5 23.5 26.5 15C26.5 6.5 23.5 3.5 15 3.5C6.5 3.5 3.5 6.5 3.5 15Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
