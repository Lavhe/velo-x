import React, {useMemo} from 'react';
import {useQuarterMile} from '../hooks/useQuarterMile';

import {tw} from 'velo-x/theme';
import {View, Text, TouchableOpacity} from 'react-native';
import {Status, UnitOfSpeed} from '../types';
import {RefreshIcon, VehicleTypeIcon} from 'velo-x/icons';
import {LocationState} from 'velo-x/location';
import {useUserContext} from 'velo-x/auth';
import ConfettiCannon from 'react-native-confetti-cannon';
import {DriveOptions} from '..';
import {convertToSentenceCase} from 'velo-x/utils';

const ClassNames = {
  Confetti: tw`w-screen h-screen absolute z-30`,
  Row: tw`flex-1 bg-white bg-gray-900`,
  SpeedometerRow: tw`mt-5 -mb-12 mx-auto justify-center`,
  RestartButtonRow: tw`items-end z-10`,
  RestartButton: tw`flex-row shadow-md rounded-full m-4 p-3 bg-white bg-gray-800 w-12 h-12`,
  RestartText: tw`font-light text-center text-md text-white`,
  Running: tw`flex flex-row justify-center shadow-xl rounded-2xl bg-white bg-gray-800 mx-6 p-4 my-auto`,
  RunningRow: tw`flex flex-1 flex-row justify-center py-3 items-end`,
  RunningAt: tw`flex-initial text-center my-auto text-lg px-4 text-gray-500`,
  RunningSpeed: tw`font-bold text-5xl my-auto text-white`,
  RunningTime: tw`font-black text-7xl text-white`,
  RunningTo: tw`font-semibold text-lg text-white`,
  RunningSeconds: tw`font-light text-xl pb-3 text-white`,
  RunningTitle: tw`font-light text-lg text-white`,
  RunningCarName: tw`font-bold text-white`,
  RunningSpeedSIUnit: tw`font-light text-lg pb-1 text-white`,
  Results: tw` shadow-xl rounded-2xl bg-white dark:bg-gray-800 mx-6 p-4 my-auto`,
  ResultsRow: tw`flex flex-row justify-center py-3 items-end`,
  ResultsSpeed: tw`font-bold text-5xl my-auto text-primary`,
  ResultsRunType: tw`font-bold text-3xl my-auto text-primary`,
  ResultsTime: tw`font-black text-7xl text-primary`,
  ResultsTo: tw`font-semibold text-lg text-white`,
  ResultsSeconds: tw`font-light text-xl pb-3 text-primary`,
  ResultsTitle: tw`font-light text-lg text-white`,
  ResultsCarName: tw`font-bold text-white`,
  ResultsSpeedSIUnit: tw`font-light text-lg pb-1 text-primary`,
  MessageText: tw`text-center text-md p-2 font-medium text-white`,
  MessageSuccess: tw`bg-green-400 p-2 mx-auto text-center rounded-lg`,
  MessageError: tw`bg-red-400 p-2 mx-auto text-center rounded-lg`,
};

export function QuarterMile({route}: any) {
  const {targetDistance, runType} = route.params;
  const {message, time, distance, speed, results, restart, locationState} =
    useQuarterMile({
      targetDistance,
      runType,
    });

  const xPosition = useMemo(() => {
    if (!distance) return null;

    return (distance / targetDistance) * 100;
  }, [targetDistance, distance]);

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
      {!results && message?.status !== Status.ERROR && (
        <>
          <Stats time={time} />
          <Running xPosition={xPosition} accentColor={accentColor} />
        </>
      )}
      <Message message={message} />
      <Distance
        runType={runType}
        results={results}
        distance={distance || 0}
        speed={speed}
      />
    </View>
  );
}

function Running(props: RunningProps) {
  const {xPosition, accentColor} = props;
  const {currentProfile} = useUserContext();
  const offset = xPosition || 0;

  return (
    <View style={tw`my-20 px-5`}>
      <View style={tw`relative border-b w-full border-${accentColor}`}>
        <VehicleTypeIcon
          vehicleType={currentProfile?.type || 'sedan'}
          style={tw`w-12 h-12 -mb-4 -ml-4 bottom-0 text-white absolute left-[${offset}%]`}
        />
        <View style={tw`absolute bottom-0 right-1 h-8 w-2 bg-${accentColor}`} />
      </View>
    </View>
  );
}

function Stats(props: StatsProps) {
  const {time} = props;

  return (
    <View style={ClassNames.Running}>
      <View style={ClassNames.RunningRow}>
        <Text style={ClassNames.RunningTime}>{time}</Text>
        <Text style={ClassNames.RunningSeconds}>seconds</Text>
      </View>
    </View>
  );
}

function Distance(props: DistanceProps) {
  const {speed, results, runType} = props;
  const {currentProfile} = useUserContext();

  const {distance, metric} = useMemo(() => {
    switch (currentProfile?.unitOfSpeed) {
      case UnitOfSpeed.KILOMETERS:
        return {
          distance: Math.floor(props.distance * 1000),
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
  }, [currentProfile?.unitOfSpeed, props.distance]);

  if (results) {
    return (
      <Results
        runType={runType}
        distance={distance}
        metric={metric}
        results={results}
      />
    );
  }

  return (
    <View style={ClassNames.Running}>
      <View style={ClassNames.RunningRow}>
        <Text style={ClassNames.RunningSpeed}>{distance}</Text>
        <Text style={ClassNames.RunningSpeedSIUnit}>{metric}</Text>
      </View>
      <Text style={ClassNames.RunningAt}>{'<>'}</Text>
      <View style={ClassNames.RunningRow}>
        <Text style={ClassNames.RunningSpeed}>{speed}</Text>
        <Text style={ClassNames.RunningSpeedSIUnit}>
          {currentProfile?.unitOfSpeed}
        </Text>
      </View>
    </View>
  );
}

function Results({
  results,
  distance,
  runType,
  metric,
}: Pick<ReturnType<typeof useQuarterMile>, 'results'> & {
  distance: number;
  metric: string;
  runType: DriveOptions;
}) {
  const {currentProfile} = useUserContext();

  if (!results) {
    return null;
  }

  return (
    <View style={ClassNames.Results}>
      <View style={ClassNames.Confetti}>
        <ConfettiCannon count={40} fallSpeed={10000} origin={{x: 0, y: 900}} />
      </View>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsTitle}>
          Your{' '}
          <Text style={ClassNames.ResultsCarName}>{currentProfile?.name}</Text>{' '}
          took
        </Text>
      </View>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsTime}>{results.time}</Text>
        <Text style={ClassNames.ResultsSeconds}>seconds</Text>
      </View>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsTo}>to cover</Text>
      </View>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsRunType}>
          {convertToSentenceCase(runType).toLowerCase()}
        </Text>
      </View>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsTo}>at a speed of</Text>
      </View>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsSpeed}>{results.speed}</Text>
        <Text style={ClassNames.ResultsSpeedSIUnit}>
          {currentProfile?.unitOfSpeed}
        </Text>
      </View>
    </View>
  );
}
function Message(props: MessageProps) {
  const {message} = props;

  if (!message) {
    return null;
  }

  const statusStyle =
    message.status === Status.SUCCESS
      ? ClassNames.MessageSuccess
      : ClassNames.MessageError;

  return (
    <View style={statusStyle}>
      <Text style={ClassNames.MessageText}>{message.message}</Text>
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
  runType: DriveOptions;
  distance: number;
  speed: number | null;
  results: ReturnType<typeof useQuarterMile>['results'];
}
interface MessageProps {
  message: {
    message: string;
    status: Status;
  } | null;
}
