import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { type IconProps } from '../types';
import { tw } from 'twrnc';

export function LogOutIcon({ style, color }: IconProps) {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <Path
        fill={(color && tw.color(color)) || '#000000'}
        d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"
      />
    </Svg>
  );
}
