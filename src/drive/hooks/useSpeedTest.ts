import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useSpeedometer} from '../hooks/useSpeedometer';
// import RecordScreen from 'react-native-record-screen';
// import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import {Collections, useCreateOrUpdateDocument} from 'velo-x/firebase';
import {schema, Type as RunType, DriveOptions} from '../schema';
import {getPreciseDistance} from 'geolib';
import {useUserContext} from 'velo-x/auth';
import {AllSpeeds, Results, Message, Status, UnitOfSpeed} from '../types';
import {linearInterpolation} from '../utils';

// TODO: Remove this once the recording plugin is working
const RecordScreen = {
  startRecording: () => Promise.resolve(),
  stopRecording: () => Promise.resolve({result: {outputURL: null}}),
};

enum States {
  PENDING,
  RUNNING,
  DONE,
}

export function useSpeedTest({
  targetSpeed,
  startSpeed,
  runType,
}: {
  targetSpeed: number;
  startSpeed: number;
  runType: DriveOptions;
}) {
  const fullScreenRef = useRef<any>();
  const {speed, timestamp, latitude, longitude, locationState} =
    useSpeedometer();
  const {currentProfile} = useUserContext();

  const [state, setState] = useState(States.PENDING);
  const [allSpeeds, setAllSpeeds] = useState<AllSpeeds>({});
  const [results, setResults] = useState<Results | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [recordingsUri, setRecordingsUri] = useState<any>();

  const {
    error: docError,
    loading: docLoading,
    addDocument,
  } = useCreateOrUpdateDocument(schema, Collections.RUNS);

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
    const locations: RunType['locations'] = Object.values(allSpeeds);

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

  const restart = useCallback(() => {
    setState(States.PENDING);
    setResults(null);
    setMessage(null);
    setTime(null);
    setAllSpeeds({});
    stopRecording({
      mustSave: false,
    });
  }, []);

  useEffect(() => {
    if (!results) {
      return;
    }

    stopRecording({
      mustSave: true,
    });
  }, [results]);

  const stopRecording = (obj: {mustSave: boolean}) => {
    const {mustSave} = obj;

    setTimeout(async () => {
      try {
        console.log('Recording stopping');
        console.log({results, allSpeeds});
        if (mustSave) {
          await saveRunToDB();
        }
        const res = await RecordScreen.stopRecording().catch(error =>
          console.warn(error),
        );

        const screenShot = await fullScreenRef.current?.capture?.();
        const screenRecording = res?.result?.outputURL || null;

        setRecordingsUri({
          screenShot,
          screenRecording,
        });

        console.log('Recording stopped!', {
          mustSave,
          screenShot,
          screenRecording,
        });
      } catch (err) {
        console.log('ERROR!', err);
        setMessage({
          message: (err as any).message,
          status: Status.ERROR,
        });
      }
    }, 2000);
  };

  const startRecording = async () => {
    console.log('Recording starting');
    await RecordScreen.startRecording().catch(error => console.error(error));
    console.log('Recording started!');
  };

  useEffect(() => {
    const {startTimestamp, endTimestamp} = calculatedTimestamp;

    if (endTimestamp == null || startTimestamp == null) {
      return;
    }

    switch (state) {
      case States.DONE: {
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

  useEffect(() => {
    if (speed === null) {
      return;
    }

    if (state === States.RUNNING && speed > startSpeed) {
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

      if (speed >= targetSpeed) {
        setAllSpeeds(p => ({...linearInterpolation(p, targetSpeed)}));
        return setState(States.DONE);
      }
      return;
    } else if (
      state === States.PENDING &&
      speed <= startSpeed &&
      timestamp > 0
    ) {
      setState(States.RUNNING);
      setAllSpeeds({});
      setMessage({
        message: 'Go!',
        status: Status.SUCCESS,
      });

      startRecording();
      return;
    } else if (state === States.PENDING && speed > startSpeed) {
      setMessage({
        message: `Your ${currentProfile?.name} must be at a speed of ${startSpeed}${currentProfile?.unitOfSpeed}`,
        status: Status.ERROR,
      });
      return;
    } else if (
      speed === startSpeed &&
      state === States.RUNNING &&
      Object.keys(allSpeeds).some(v => allSpeeds[v].speed > startSpeed)
    ) {
      return restart();
    }
  }, [
    speed,
    timestamp,
    latitude,
    longitude,
    restart,
    state,
    currentProfile?.name,
  ]);

  const shareRecordings = () => {
    const urls: string[] = [];
    if (recordingsUri?.screenShot) {
      urls.push(recordingsUri.screenShot);
    }

    if (recordingsUri?.screenRecording) {
      urls.push(recordingsUri.screenRecording);
    }

    if (urls.length) {
      Share.open({
        title: `${currentProfile?.name} run`,
        urls,
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    }
  };

  return {
    speed,
    state,
    results,
    restart,
    message,
    time,
    locationState,
    fullScreenRef,
    recordingsUri,
    shareRecordings,
  };
}
