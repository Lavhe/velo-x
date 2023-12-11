import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSpeedometer } from '../hooks/useSpeedometer';
// import RecordScreen from 'react-native-record-screen';
// import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

// TODO: Remove this once the recording plugin is working
const RecordScreen = {
  startRecording: () => Promise.resolve(),
  stopRecording: () => Promise.resolve({ result: { outputURL: null } })
};

// TODO: Move this variable to the settings context
const TARGET_SPEED = 100;

enum States {
  PENDING,
  RUNNING,
  DONE
}
export enum Status {
  SUCCESS,
  ERROR
}

export function useSpeedTest() {
  const fullScreenRef = useRef<any>();
  const { speed, timestamp, locationState } = useSpeedometer();
  const { currentProfile } = {
    currentProfile: { VEHICLE_NAME: 'Golf GTI TCR' }
  };
  const [state, setState] = useState(States.PENDING);
  const [allSpeeds, setAllSpeeds] = useState<AllSpeeds>({});
  const [results, setResults] = useState<Results | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [recordingsUri, setRecordingsUri] = useState<any>();

  const restart = useCallback(() => {
    setState(States.PENDING);
    setResults(null);
    setMessage(null);
    setTime(null);
    setAllSpeeds({});
    stopRecording({
      mustSave: false
    });
  }, []);

  const calculatedTimestamp = useMemo(() => {
    let startTimestamp;
    let endTimestamp;
    const allTimestamps = Object.keys(allSpeeds);
    for (const currentTimestampValue of allTimestamps) {
      const currentTimestamp = +currentTimestampValue;
      if (endTimestamp === undefined || currentTimestamp > endTimestamp)
        endTimestamp = currentTimestamp;
      if (startTimestamp === undefined || currentTimestamp < startTimestamp)
        startTimestamp = currentTimestamp;
    }

    return { startTimestamp, endTimestamp };
  }, [allSpeeds]);

  const stopRecording = (obj: { mustSave: boolean }) => {
    const { mustSave } = obj;

    setTimeout(async () => {
      try {
        console.log('Recording stopping');

        const res = await RecordScreen.stopRecording().catch((error) =>
          console.warn(error)
        );

        const screenShot = await fullScreenRef.current?.capture?.();
        const screenRecording = res?.result?.outputURL || null;

        setRecordingsUri({
          screenShot,
          screenRecording
        });

        console.log('Recording stopped!', {
          mustSave,
          screenShot,
          screenRecording
        });
      } catch (err) {
        console.log('ERROR!', err);
      }
    }, 2000);
  };

  const startRecording = async () => {
    console.log('Recording starting');
    await RecordScreen.startRecording().catch((error) => console.error(error));
    console.log('Recording started!');
  };

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
          speed: +allSpeeds[endTimestamp],
          time: ((endTimestamp - startTimestamp) / 1000).toFixed(2)
        });

        stopRecording({
          mustSave: true
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
    console.log({ timestamp, speed });

    if (state === States.RUNNING && speed > 0) {
      setMessage(null);
      setAllSpeeds((a) => ({
        ...a,
        [timestamp]: speed
      }));

      if (speed >= TARGET_SPEED) {
        return setState(States.DONE);
      }
      return;
    } else if (state === States.PENDING && speed === 0 && timestamp > 0) {
      setState(States.RUNNING);
      setAllSpeeds({});
      setMessage({
        message: 'Go!',
        status: Status.SUCCESS
      });

      startRecording();
      return;
    } else if (state === States.PENDING && speed > 0) {
      setMessage({
        message: `Stop your ${currentProfile?.VEHICLE_NAME} first`,
        status: Status.ERROR
      });
      return;
    } else if (
      speed === 0 &&
      state === States.RUNNING &&
      Object.keys(allSpeeds).some((v) => allSpeeds[v] > 0)
    ) {
      return restart();
    }
  }, [speed, timestamp, restart, state, currentProfile?.VEHICLE_NAME]);

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
        title: `${currentProfile?.VEHICLE_NAME} run`,
        urls
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
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
    shareRecordings
  };
}
interface Results {
  speed: number;
  time: string;
}
interface AllSpeeds {
  [timestamp: string]: number;
}
interface Message {
  status: Status;
  message: string;
}
