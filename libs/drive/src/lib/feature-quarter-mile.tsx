import React, { useEffect, useMemo } from 'react';
import { Status, useQuarterMile } from '../hooks/useQuarterMile';

import { tw } from 'theme';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { UnitOfSpeed } from '../types';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { RefreshIcon, CarIcon } from 'icons';
import { LocationState } from 'location';

/* eslint-disable-next-line */
export interface QuarterMileProps {}

const ClassNames = {
  Confetti: tw`w-screen h-screen absolute z-30`,
  Row: tw`flex-1 bg-white dark:bg-gray-900`,
  SpeedometerRow: tw`mt-5 -mb-12 mx-auto justify-center`,
  RestartButtonRow: tw`absolute right-1 z-10`,
  RestartButton: tw`flex-row shadow-md rounded-full m-4 p-3 bg-white dark:bg-gray-800 w-12 h-12`,
  RestartText: tw`font-light text-center text-md text-white`,
  Results: tw`flex flex-row justify-center shadow-xl rounded-2xl bg-white dark:bg-gray-800 mx-6 p-4 my-auto`,
  ResultsRow: tw`flex flex-1 flex-row justify-center py-3 items-end`,
  At: tw`flex-initial text-center my-auto text-lg px-4`,
  ResultsSpeed: tw`font-bold text-5xl my-auto`,
  ResultsTime: tw`font-black text-7xl`,
  ResultsTo: tw`font-semibold text-lg`,
  ResultsSeconds: tw`font-light text-xl pb-3`,
  ResultsTitle: tw`font-light text-lg`,
  ResultsCarName: tw`font-bold`,
  ResultsSpeedSIUnit: tw`font-light text-lg pb-1`,
  MessageText: tw`text-center text-md p-2 font-medium`,
  MessageSuccess: tw`bg-green-300 p-2 mx-auto text-center`,
  MessageError: tw`bg-red-300 p-2 mx-auto text-center`,
  CarIcon: tw`w-12 h-12 -mb-2 text-white`,
};
const { width: screenWidth } = Dimensions.get('window');

export function QuarterMile(props: QuarterMileProps) {
  const {
    message,
    time,
    distance,
    speed,
    restart,
    destinationDistance,
    locationState,
  } = useQuarterMile();

  const xPosition = useMemo(() => {
    if (!distance) return null;

    return (distance / destinationDistance) * screenWidth;
  }, [destinationDistance, distance]);

  const accentColor = useMemo(() => {
    switch (locationState) {
      case LocationState.BAD:
        return 'red-400';
      case LocationState.GOOD:
        return 'green-600';
      case LocationState.PENDING:
        return 'yellow-400';
      default:
        return 'black';
    }
  }, [locationState]);

  return (
    <View style={ClassNames.Row}>
      <View style={ClassNames.RestartButtonRow}>
        <TouchableOpacity style={ClassNames.RestartButton} onPress={restart}>
          <RefreshIcon style={ClassNames.RestartText} />
        </TouchableOpacity>
      </View>
      <Stats time={time} />
      <Running xPosition={xPosition} accentColor={accentColor} />
      <Distance distance={distance || 0} speed={speed} />
      <Message message={message} />
    </View>
  );
}

function Running(props: RunningProps) {
  const { xPosition, accentColor } = props;
  const offset = useSharedValue(xPosition || 0);

  useEffect(() => {
    if (xPosition !== null) {
      offset.value = xPosition;
    }
  }, [xPosition]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  return (
    <View style={tw`my-20 px-5`}>
      <View style={tw`border-b w-full border-${accentColor}`}>
        <Animated.View style={animatedStyles}>
          <CarIcon style={ClassNames.CarIcon} />
        </Animated.View>
        <View style={tw`absolute right-1 h-8 w-2 bg-${accentColor}`} />
      </View>
    </View>
  );
}

function Stats(props: StatsProps) {
  const { time } = props;

  return (
    <View style={ClassNames.Results}>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsTime}>{time}</Text>
        <Text style={ClassNames.ResultsSeconds}>seconds</Text>
      </View>
    </View>
  );
}

function Distance(props: DistanceProps) {
  const { speed } = props;
  const { currentProfile } = {
    currentProfile: {
      VEHICLE_NAME: 'Golf GTI TCR',
      UNIT_OF_SPEED: UnitOfSpeed.KILOMETERS,
    },
  };

  const { distance, metric } = useMemo(() => {
    switch (currentProfile?.UNIT_OF_SPEED) {
      case UnitOfSpeed.KILOMETERS:
        return {
          distance: Math.floor(props.distance),
          metric: 'm',
        };
      case UnitOfSpeed.MILES:
        return {
          distance: props.distance,
          metric: 'miles',
        };
      default:
        return {
          distance: props.distance,
          metric: '??',
        };
    }
  }, [currentProfile?.UNIT_OF_SPEED, props.distance]);

  return (
    <View style={ClassNames.Results}>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsSpeed}>{distance}</Text>
        <Text style={ClassNames.ResultsSpeedSIUnit}>{metric}</Text>
      </View>
      <Text style={ClassNames.At}>{'<>'}</Text>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsSpeed}>{speed}</Text>
        <Text style={ClassNames.ResultsSpeedSIUnit}>
          {currentProfile?.UNIT_OF_SPEED}
        </Text>
      </View>
    </View>
  );
}
function Message(props: MessageProps) {
  const { message } = props;
  console.log({ message });
  if (!message) {
    return null;
  }

  const statusStyle =
    message.status === Status.SUCCESS
      ? ClassNames.MessageSuccess
      : ClassNames.MessageError;

  return (
    <View>
      <View style={statusStyle}>
        <Text style={ClassNames.MessageText}>{message.message}</Text>
      </View>
    </View>
  );
}

interface RunningProps {
  xPosition: number | null;
  accentColor: string;
}
interface StatsProps {
  time: string | null;
}
interface DistanceProps {
  distance: number;
  speed: number | null;
}
interface MessageProps {
  message: {
    message: string;
    status: Status;
  } | null;
}
