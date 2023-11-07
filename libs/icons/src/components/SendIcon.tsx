import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { type IconProps } from '../types';
import { tw } from 'twrnc';

export function SendIcon({ style, color }: IconProps) {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <Path
        fill={(color && tw.color(color)) || '#000000'}
        d="M3 20V4L22 12M5 17L16.85 12L5 7V10.5L11 12L5 13.5M5 17V7 13.5Z"
      />
    </Svg>
  );
}
