import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { type IconProps } from '../types';
import { tw } from 'twrnc';

export function CloseIcon({ style, color }: IconProps) {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <Path
        fill={(color && tw.color(color)) || '#000000'}
        d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
      />
    </Svg>
  );
}
