import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { type IconProps } from '../types';
import { tw } from 'theme';

export function MenuIcon({ style, color }: IconProps) {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <Path
        fill={(color && tw.color(color)) || '#000000'}
        d="M3,6H21V8H3V6M3,11H14V13H3V11M3,16H9V18H3V16Z"
      />
    </Svg>
  );
}
