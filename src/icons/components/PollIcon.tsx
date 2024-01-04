import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {type IconProps} from '../types';
import {tw} from 'velo-x/theme';

export function PollIcon({style, color}: IconProps) {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <Path
        fill={(color && tw.color(color)) || 'currentColor'}
        d="M3,22V8H7V22H3M10,22V2H14V22H10M17,22V14H21V22H17Z"
      />
    </Svg>
  );
}
