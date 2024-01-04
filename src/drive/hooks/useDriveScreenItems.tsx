import {useCallback, useMemo, useState} from 'react';

import {
  BrakeIcon,
  QuarterMileIcon,
  RaceIcon,
  SpeedometerIcon,
} from 'velo-x/icons';
import {useNavigation} from '@react-navigation/native';
import {useUserContext} from 'velo-x/auth';
import {UnitOfSpeed} from '../types';
import {DriveOptions} from '..';
import {convertToSentenceCase} from 'velo-x/utils';

const MILE_IN_KM = 1.61;

const milesLookup = {
  'half-quarter-mile': {
    [UnitOfSpeed.KILOMETERS]: MILE_IN_KM / 8,
    [UnitOfSpeed.MILES]: 1 / 8,
  },
  'quarter-mile': {
    [UnitOfSpeed.KILOMETERS]: MILE_IN_KM / 4,
    [UnitOfSpeed.MILES]: 1 / 4,
  },
  'half-mile': {
    [UnitOfSpeed.KILOMETERS]: MILE_IN_KM / 2,
    [UnitOfSpeed.MILES]: 1 / 2,
  },
  mile: {
    [UnitOfSpeed.KILOMETERS]: MILE_IN_KM,
    [UnitOfSpeed.MILES]: 1,
  },
};

const metric = {
  [UnitOfSpeed.KILOMETERS]: (value: number) => `${+value * 1000} meters`,
  [UnitOfSpeed.MILES]: (value: number) => `${value} miles`,
} as const;

export function useDriveScreenItems() {
  const {navigate} = useNavigation();
  const {currentProfile} = useUserContext();
  const unitOfSpeed = currentProfile?.unitOfSpeed ?? UnitOfSpeed.KILOMETERS;

  const landingScreenItems: LandingScreenItem[] = Object.values(
    DriveOptions,
  ).map(value => {
    if (value.includes('-to-')) {
      const speeds = value.split('-to-');
      const [startSpeed, targetSpeed] = speeds.map(speed => +speed);

      return {
        title: `${startSpeed} - ${targetSpeed}${unitOfSpeed} test`,
        description: `Tests the acceleration of your ${
          currentProfile?.name ?? 'vehicle'
        } from ${startSpeed} to ${targetSpeed}${unitOfSpeed}`,
        icon: RaceIcon,
        routeName: 'SpeedTest',
        params: {
          startSpeed,
          targetSpeed,
          runType: DriveOptions[value],
        },
      };
    }

    if (value.includes('-mile')) {
      const [targetDistance] = value.split('-mile');

      return {
        title: `${convertToSentenceCase(value)} run`,
        description: `See how fast your ${
          currentProfile?.name ?? 'vehicle'
        } travels over ${convertToSentenceCase(value)}`,
        icon: QuarterMileIcon,
        routeName: 'QuarterMile',
        params: {
          targetDistance:
            milesLookup[value as keyof typeof milesLookup][unitOfSpeed],
          runType: DriveOptions[value],
        },
      };
    }

    return {
      title: `${value} run`,
      description: value,
      icon: QuarterMileIcon,
      routeName: 'QuarterMile',
      params: {
        startSpeed: 0,
        targetSpeed: 0,
        runType: DriveOptions[value],
      },
    };
  });

  const onPress = useCallback(
    (landingScreenItem: LandingScreenItem) => {
      return navigate({
        name: landingScreenItem.routeName,
        params: {
          ...(landingScreenItem.params || {}),
        },
      } as never);
    },
    [navigate],
  );

  return {landingScreenItems, onPress};
}
interface LandingScreenItem {
  title: string;
  description: string;
  routeName: string;
  icon: (props: any) => JSX.Element;
  params: {
    runType: DriveOptions;
  } & (
    | {
        startSpeed: number;
        targetSpeed: number;
      }
    | {
        targetDistance: number;
      }
  );
}
