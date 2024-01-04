import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSpeedometer} from '../hooks/useSpeedometer';
import {AllSpeeds, Message, Results, Status, UnitOfSpeed} from '../types';
import {getPreciseDistance} from 'geolib';
import {useUserContext} from 'velo-x/auth';
import {Collections, useCreateOrUpdateDocument} from 'velo-x/firebase';
import {schema, DriveOptions} from '../schema';

enum States {
  PENDING,
  RUNNING,
  DONE,
}
export function useQuarterMile({
  targetDistance,
  runType,
}: {
  targetDistance: number;
  runType: DriveOptions;
}) {
  const {speed, timestamp, latitude, longitude, locationState} =
    useSpeedometer();
  const {currentProfile} = useUserContext();
  const {
    error: docError,
    loading: docLoading,
    addDocument,
  } = useCreateOrUpdateDocument(schema, Collections.RUNS);

  const [state, setState] = useState(States.PENDING);
  const [allSpeeds, setAllSpeeds] = useState<AllSpeeds>({});
  const [results, setResults] = useState<Results | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const restart = useCallback(() => {
    setState(States.PENDING);
    setResults(null);
    setMessage(null);
    setTime(null);
    setAllSpeeds({});
  }, []);

  const calculatedTimestamp = useMemo(() => {
    let startTimestamp;
    let endTimestamp;
    const allTimestamps = Object.keys(allSpeeds);
    for (const currentTimestampValue of allTimestamps) {
      const currentTimestamp = +currentTimestampValue;
      if (endTimestamp === undefined || currentTimestamp > endTimestamp) {
        endTimestamp = currentTimestamp;
      }
      if (startTimestamp === undefined || currentTimestamp < startTimestamp) {
        startTimestamp = currentTimestamp;
      }
    }

    return {startTimestamp, endTimestamp};
  }, [allSpeeds]);

  const distanceDivider = useMemo(() => {
    switch (currentProfile?.unitOfSpeed) {
      case UnitOfSpeed.KILOMETERS:
        return 1000;
      case UnitOfSpeed.MILES:
        return 1609;
      default:
        return 1;
    }
  }, [currentProfile?.unitOfSpeed]);

  const distance = useMemo(() => {
    const {startTimestamp, endTimestamp} = calculatedTimestamp;

    if (endTimestamp == null || startTimestamp == null) {
      return 0;
    }

    const distanceInMeters = getPreciseDistance(
      {
        latitude: allSpeeds[startTimestamp].lat,
        longitude: allSpeeds[startTimestamp].lng,
      },
      {
        latitude: allSpeeds[endTimestamp].lat,
        longitude: allSpeeds[endTimestamp].lng,
      },
    );

    return distanceInMeters / distanceDivider;
  }, [allSpeeds, calculatedTimestamp, distanceDivider]);

  const saveRunToDB = async () => {
    const speed = results?.speed && +results?.speed;
    const time = results?.time && +results.time;
    const locations = Object.values(allSpeeds);

    if (!speed) {
      throw new Error('Speed is missing');
    }

    if (!time) {
      throw new Error('Time is missing');
    }

    if (!currentProfile) {
      throw new Error('No vehicle was selected');
    }

    await addDocument({
      [runType]: {
        time,
        speed,
        distance,
      },
      profile: currentProfile,
      locations,
    });
  };

  useEffect(() => {
    if (!results) {
      return;
    }

    saveRunToDB();
  }, [results]);

  useEffect(() => {
    const {startTimestamp, endTimestamp} = calculatedTimestamp;

    if (endTimestamp == null || startTimestamp == null) {
      return;
    }

    switch (state) {
      case States.DONE: {
        setResults(null);
        setMessage(null);

        setResults({
          speed: +allSpeeds[endTimestamp].speed,
          time: ((endTimestamp - startTimestamp) / 1000).toFixed(2),
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
      Object.keys(allSpeeds).some(v => allSpeeds[v].speed > 0)
    );
  }, [allSpeeds, distance, state]);

  useEffect(() => {
    if (speed === null) {
      return;
    }

    if (state === States.RUNNING && speed === 0) {
      setAllSpeeds(a => ({
        ...a,
        [timestamp]: {
          speed,
          lat: latitude,
          lng: longitude,
          date: new Date(timestamp),
        },
      }));
    }

    if (state === States.RUNNING && speed > 0) {
      setMessage(null);
      setAllSpeeds(a => ({
        ...a,
        [timestamp]: {
          speed,
          lat: latitude,
          lng: longitude,
          date: new Date(timestamp),
        },
      }));

      if (distance && distance >= targetDistance) {
        return setState(States.DONE);
      }
      return;
    } else if (state === States.PENDING && speed === 0 && timestamp > 0) {
      setState(States.RUNNING);
      setAllSpeeds({});
      setMessage({
        message: 'Go!',
        status: Status.SUCCESS,
      });
      return;
    } else if (state === States.PENDING && speed > 0) {
      setMessage({
        message: `Stop your ${currentProfile?.name} first`,
        status: Status.ERROR,
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
    currentProfile?.name,
    latitude,
    longitude,
    targetDistance,
  ]);

  return {
    targetDistance,
    distance,
    speed,
    state,
    results,
    restart,
    message,
    time,
    locationState,
  };
}
