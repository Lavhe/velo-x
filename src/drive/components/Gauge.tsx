import {tw} from 'velo-x/theme';
import React, {useMemo, memo, useState, useEffect} from 'react';
import {View, Dimensions} from 'react-native';
import Svg, {Path, Circle, Text, G, Rect} from 'react-native-svg';
// import Animated from 'react-native-reanimated';
import {LocationState} from 'velo-x/location';
import {useUserContext} from 'velo-x/auth';

const {width} = Dimensions.get('window');
const size = width - 20;
const strokeWidth = 40;
const {PI, cos, sin} = Math;
const r = (size - strokeWidth) / 2;
const cx = size / 2;
const cy = size / 2;
const A = PI + PI * 0.35;
const startAngle = PI + PI * 0.2;
const endAngle = 2 * PI - PI * 0.2;
// A rx ry x-axis-rotation large-arc-flag sweep-flag x y
const x1 = cx - r * cos(startAngle);
const y1 = -r * sin(startAngle) + cy;
const x2 = cx - r * cos(endAngle);
const y2 = -r * sin(endAngle) + cy;

const d = `M ${x2} ${y2} A ${r} ${r} 0 1 1 ${x1} ${y1}`;

interface CircularProgressProps {
  speed: number | null;
  locationState: LocationState;
}

// const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedPath = (props: Record<string, string | number | undefined>) =>
  null;

function AllSpeeds() {
  const {currentProfile} = useUserContext();
  const MAX_SPEED = currentProfile?.maxSpeed || 260;

  const {speeds} = useMemo(() => {
    const speeds = [];
    for (let speed = 0; speed <= MAX_SPEED; speed += 10) {
      const angle = (speed / MAX_SPEED) * A;

      const x = cx - r * cos(angle + 100);
      const y = -r * sin(angle + 100) + cy;

      const innerX = cos(angle + 100) * 38;
      const innerY = sin(angle + 100) * 38;

      speeds.push({
        x,
        y,
        innerX,
        innerY,
        speed,
        angle: -120 + (speed / MAX_SPEED) * 245,
      });
    }

    return {speeds};
  }, []);

  return (
    <>
      {speeds.map((s, i) => (
        <G key={i} x={s.x} y={s.y}>
          <Rect
            width="1"
            height="10"
            rotation={s.angle}
            stroke={'black'}
            fill={'black'}
          />
          {s.speed % 20 === 0 && (
            <>
              <Text
                fill={'white'}
                fontSize="14"
                fontWeight={600}
                textAnchor="middle"
                x={s.innerX}
                y={s.innerY}>
                {s.speed}
              </Text>
              <Rect
                width="2"
                height="20"
                rotation={s.angle}
                fill={tw.color('primary')}
              />
            </>
          )}
        </G>
      ))}
    </>
  );
}

export function SpeedometerGauge(props: CircularProgressProps) {
  const {speed, locationState} = props;
  const {currentProfile} = useUserContext();
  const MAX_SPEED = currentProfile?.maxSpeed || 260;

  const GaugeStickMemo = () => {
    const angle = ((speed || 0) / MAX_SPEED) * A;

    const newX = cx - r * cos(angle + 100);
    const newY = -r * sin(angle + 100) + cy;

    return (
      <Path
        id="gauge-stick"
        stroke={tw.color('primary')}
        strokeWidth={5}
        strokeLinecap="round"
        d={`M ${(x2 + x1) / 2} ${(y2 + y1) / 3} L ${newX} ${newY}`}
      />
    );
  };

  const centerCircleFill = useMemo(() => {
    switch (locationState) {
      case LocationState.BAD:
        return 'red';
      case LocationState.GOOD:
      case LocationState.PENDING:
        return 'lime';
      default:
        return 'black';
    }
  }, [locationState]);

  return (
    <Svg width={size} height={size} style={tw`transition-all duration-500`}>
      <Path
        stroke={tw.color('gray-800')}
        fill="none"
        id="circle"
        {...{d, strokeWidth}}
      />
      <AllSpeeds />
      <GaugeStickMemo />

      <Circle
        fill={centerCircleFill}
        r={12}
        cx={(x2 + x1) / 2}
        cy={(y2 + y1) / 3}
      />
      <Text
        x={(x2 + x1) / 2.5}
        y={y1 - 20}
        fill={tw.color('primary')}
        fontSize="22">
        {speed || 0} {currentProfile?.unitOfSpeed}
      </Text>
    </Svg>
  );
}
