import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { type IconProps } from '../types';
import { tw } from 'theme';

export function FilterIcon({ style, color }: IconProps) {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <Path
        fill={(color && tw.color(color)) || 'currentColor'}
        d="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z"
      />
    </Svg>
  );
}
