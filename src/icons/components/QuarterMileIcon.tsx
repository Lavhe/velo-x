import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {type IconProps} from '../types';
import {tw} from 'velo-x/theme';

export function QuarterMileIcon({style, color}: IconProps) {
  return (
    <Svg style={style} viewBox="0 0 32 32">
      <Path
        fill={(color && tw.color(color)) || 'currentColor'}
        d="M11,11v2H9v-2H11z M13,11v2h2v-2H13z M19,9V7h-2v2H19z M11,9v2h2V9H11z M11,9V7H9v2H11z M9,9H7v2
        h2V9z M19,9v2h2V9H19z M15,9v2h2V9H15z M17,11v2h2v-2H17z M23,11h2V9h-2V11z M29,3v26h-2V17H5v12H3V3H29z M27,5h-2v2h-2V5h-2v2h-2V5
        h-2v2h-2V5h-2v2h-2V5H9v2H7V5H5v2h2v2H5v2h2v2H5v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h2v2h2v-2h-2v-2h2V9h-2V7h2V5z M15,9V7
        h-2v2H15z M23,9V7h-2v2H23z M21,11v2h2v-2H21z"
      />
    </Svg>
  );
}
