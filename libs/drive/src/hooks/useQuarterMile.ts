import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSpeedometer } from '../hooks/useSpeedometer';
import { UnitOfSpeed } from '../types';
import { getPreciseDistance } from 'geolib';

// TODO: Move this variable to the settings context
const TARGET_DISTANCE = 100;

enum States {
  PENDING,
  RUNNING,
  DONE
}
export enum Status {
  SUCCESS,
  ERROR
}

export function useQuarterMile() {
  const { speed, timestamp, latitude, longitude, locationState } =
    useSpeedometer();
  const { currentProfile } = {
    currentProfile: {
      VEHICLE_NAME: 'Golf GTI TCR',
      UNIT_OF_SPEED: UnitOfSpeed.KILOMETERS
    }
  };
  const [state, setState] = useState(States.PENDING);
  const [allLocations, setAllLocations] = useState<AllLocations>({});
  const [results, setResults] = useState<Results | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const restart = useCallback(() => {
    setState(States.PENDING);
    setResults(null);
    setMessage(null);
    setTime(null);
    setAllLocations({});
  }, []);

  const calculatedTimestamp = useMemo(() => {
    let startTimestamp;
    let endTimestamp;
    const allTimestamps = Object.keys(allLocations);
    for (const currentTimestampValue of allTimestamps) {
      const currentTimestamp = +currentTimestampValue;
      if (endTimestamp === undefined || currentTimestamp > endTimestamp)
        endTimestamp = currentTimestamp;
      if (startTimestamp === undefined || currentTimestamp < startTimestamp)
        startTimestamp = currentTimestamp;
    }

    return { startTimestamp, endTimestamp };
  }, [allLocations]);

  const distanceDivider = useMemo(() => {
    switch (currentProfile?.UNIT_OF_SPEED) {
      case UnitOfSpeed.KILOMETERS:
        return 1000;
      case UnitOfSpeed.MILES:
        return 1609;
      default:
        return 1;
    }
  }, [currentProfile?.UNIT_OF_SPEED]);

  const destinationDistance = useMemo(() => {
    switch (currentProfile?.UNIT_OF_SPEED) {
      case UnitOfSpeed.KILOMETERS:
        return 0.4023;
      case UnitOfSpeed.MILES:
        return 0.25;
      default:
        return 1;
    }
  }, [currentProfile?.UNIT_OF_SPEED]);

  const distance = useMemo(() => {
    const { startTimestamp, endTimestamp } = calculatedTimestamp;

    if (endTimestamp == null || startTimestamp == null) {
      return null;
    }

    const distanceInMeters = getPreciseDistance(
      allLocations[startTimestamp],
      allLocations[endTimestamp]
    );

    return distanceInMeters / distanceDivider;
  }, [allLocations, calculatedTimestamp, distanceDivider]);

  useEffect(() => {
    const { startTimestamp, endTimestamp } = calculatedTimestamp;

    if (endTimestamp == null || startTimestamp == null) {
      return;
    }

    switch (state) {
      case States.DONE: {
        setResults(null);
        setMessage(null);

        setResults({
          time: ((endTimestamp - startTimestamp) / 1000).toFixed(2)
        });
        break;
      }
      case States.RUNNING: {
        setTime(((endTimestamp - startTimestamp) / 1000).toFixed(2));
        break;
      }
    }
  }, [calculatedTimestamp, state]);

  const mustRestart = useMemo(() => {
    return (
      distance === 0 &&
      state === States.RUNNING &&
      Object.keys(allLocations).some((v) => allLocations[v].timestamp > 0)
    );
  }, [allLocations, distance, state]);

  useEffect(() => {
    console.log({ distance });
    if (speed === null) {
      return;
    }

    if (state === States.RUNNING && timestamp > 0) {
      setMessage(null);
      setAllLocations((a) => ({
        ...a,
        [timestamp]: { speed, timestamp, latitude, longitude }
      }));

      if (distance && distance >= TARGET_DISTANCE) {
        return setState(States.DONE);
      }
      return;
    } else if (state === States.PENDING && !distance && timestamp > 0) {
      setState(States.RUNNING);
      setAllLocations({});
      setMessage({
        message: 'Go!',
        status: Status.SUCCESS
      });
      return;
    } else if (state === States.PENDING && timestamp > 0) {
      setMessage({
        message: `Stop your ${currentProfile?.VEHICLE_NAME} first`,
        status: Status.ERROR
      });
      return;
    } else if (mustRestart) {
      return restart();
    }
  }, [
    mustRestart,
    distance,
    timestamp,
    restart,
    state,
    currentProfile?.VEHICLE_NAME,
    latitude,
    longitude
  ]);

  return {
    destinationDistance,
    distance,
    speed,
    state,
    results,
    restart,
    message,
    time,
    locationState
  };
}
interface Results {
  time: string;
}
interface AllLocations {
  [timestamp: string]: CurrentLocation;
}
interface Message {
  status: Status;
  message: string;
}
