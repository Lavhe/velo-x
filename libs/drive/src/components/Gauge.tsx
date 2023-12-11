import { tw } from 'theme';
import React, { useMemo, memo } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, Circle, Text, G, Rect } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import { LocationState } from 'location';

const { width } = Dimensions.get('window');
const size = width - 20;
const strokeWidth = 40;
const { PI, cos, sin } = Math;
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

const AnimatedPath = Animated.createAnimatedComponent(Path);

function AllSpeeds() {
  const { currentProfile } = {
    currentProfile: {
      maxSpeed: 260,
    },
  };
  const MAX_SPEED = currentProfile?.maxSpeed || 260;

  const { speeds } = useMemo(() => {
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

    return { speeds };
  }, []);

  return (
    <View>
      {speeds.map((s, i) => (
        <G key={i} x={s.x} y={s.y}>
          <Rect
            width="1"
            height="10"
            rotation={s.angle}
            fill={tw.color('primary')}
          />
          {s.speed % 20 === 0 && (
            <View>
              <Text
                fill={tw.color('primary')}
                fontSize="14"
                fontWeight={600}
                textAnchor="middle"
                x={s.innerX}
                y={s.innerY}
              >
                {s.speed}
              </Text>
              <Rect
                width="2"
                height="20"
                rotation={s.angle}
                fill={tw.color('primary')}
              />
            </View>
          )}
        </G>
      ))}
    </View>
  );
}

const AllSpeedsMemo = memo(AllSpeeds);

export function SpeedometerGauge(props: CircularProgressProps) {
  const { speed, locationState } = props;
  const { currentProfile } = {
    currentProfile: {
      maxSpeed: 260,
      unitOfSpeed: 'km/h',
    },
  };
  const MAX_SPEED = currentProfile?.maxSpeed || 260;

  const GaugeStickMemo = memo(() => {
    const angle = ((speed || 0) / MAX_SPEED) * A;

    const newX = cx - r * cos(angle + 100);
    const newY = -r * sin(angle + 100) + cy;

    return (
      <AnimatedPath
        stroke={tw.color('primary')}
        strokeWidth={5}
        strokeLinecap="round"
        d={`M ${(x2 + x1) / 2} ${(y2 + y1) / 3} L ${newX} ${newY}`}
      />
    );
  });

  const centerCircleFill = useMemo(() => {
    switch (locationState) {
      case LocationState.BAD:
        return 'red';
      case LocationState.GOOD:
        return 'green';
      case LocationState.PENDING:
        return 'yellow';
      default:
        return 'black';
    }
  }, [locationState]);

  return (
    <Svg width={size} height={size}>
      <Path
        stroke={tw.prefixMatch('dark') ? 'white' : tw.color('secondary')}
        fill="none"
        id="circle"
        {...{ d, strokeWidth }}
      />
      <AllSpeedsMemo />
      <GaugeStickMemo />

      <Circle
        stroke={tw.prefixMatch('dark') ? 'white' : tw.color('secondary')}
        fill={centerCircleFill}
        r={12}
        cx={(x2 + x1) / 2}
        cy={(y2 + y1) / 3}
      />
      <Text
        x={(x2 + x1) / 2.5}
        y={y1 - 20}
        fill={tw.color('primary')}
        fontSize="22"
      >
        {speed || 0} {currentProfile?.unitOfSpeed}
      </Text>
    </Svg>
  );
}
