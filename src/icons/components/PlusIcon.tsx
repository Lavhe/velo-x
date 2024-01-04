import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {type IconProps} from '../types';
import {tw} from 'velo-x/theme';

export function PlusIcon({style, color}: IconProps) {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <Path
        fill={(color && tw.color(color)) || 'currentColor'}
        d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
      />
    </Svg>
  );
}
