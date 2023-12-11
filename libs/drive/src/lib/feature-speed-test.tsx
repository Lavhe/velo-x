import { tw } from 'theme';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { SpeedometerIcon, RefreshIcon, ShareIcon } from 'icons';
import { Status, useSpeedTest } from '../hooks/useSpeedTest';
import { SpeedometerGauge } from '../components/Gauge';
// import ConfettiCannon from 'react-native-confetti-cannon';
// import ViewShot from 'react-native-view-shot';

// TODO: Replace after installing plugin
const ConfettiCannon = (props: any) => null;

/* eslint-disable-next-line */
export interface FeatureSpeedometerProps {}

const ClassNames = {
  Confetti: tw`w-screen h-screen absolute z-30 opacity-60`,
  Row: tw`flex-1 bg-white dark:bg-gray-900`,
  SpeedometerRow: tw`mt-5 -mb-12 mx-auto justify-center`,
  RestartButtonRow: tw`absolute right-1 z-10`,
  RestartButton: tw`flex-row shadow-md rounded-full m-4 p-3 bg-white dark:bg-gray-800 w-12 h-12`,
  RestartText: tw`font-light text-center text-md text-white`,
  Results: tw` shadow-xl rounded-2xl bg-white dark:bg-gray-800 mx-6 p-4 my-auto`,
  ResultsRow: tw`flex flex-row justify-center py-3 items-end`,
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
  ShareResults: tw`absolute bottom-10 w-full mx-auto place-items-center justify-center align-center`,
  ShareResultsIcon: tw`font-light mx-auto w-20 h-20`,
};

export function SpeedTest() {
  useColorScheme();
  const {
    speed,
    restart,
    message,
    results,
    time,
    locationState,
    fullScreenRef,
    recordingsUri,
    shareRecordings,
  } = useSpeedTest();

  return (
    /* TODO: Replace the View with ViewShot if you wanna fight ios */
    <View ref={fullScreenRef as any} style={ClassNames.Row}>
      <>
        <View style={ClassNames.RestartButtonRow}>
          <TouchableOpacity style={ClassNames.RestartButton} onPress={restart}>
            <RefreshIcon style={ClassNames.RestartText} />
          </TouchableOpacity>
        </View>
        <RunningSpeedTest
          results={results}
          speed={speed}
          locationState={locationState}
        />
        <Message message={message} />
        <Results results={results} />
        <CurrentTimer message={message} results={results} time={time} />

        {recordingsUri && (
          <TouchableOpacity
            onPress={shareRecordings}
            style={ClassNames.ShareResults}
          >
            <ShareIcon color={'white'} style={ClassNames.ShareResultsIcon} />
          </TouchableOpacity>
        )}
      </>
    </View>
  );
}

function RunningSpeedTest({
  speed,
  results,
  locationState,
}: Pick<
  ReturnType<typeof useSpeedTest>,
  'speed' | 'results' | 'locationState'
>) {
  if (results) {
    return null;
  }

  return (
    <View style={ClassNames.SpeedometerRow}>
      <SpeedometerGauge speed={speed} locationState={locationState} />
    </View>
  );
}

function Results({
  results,
}: Pick<ReturnType<typeof useSpeedTest>, 'results'>) {
  const { currentProfile } = {
    currentProfile: {
      vehicleName: 'Golf GTI TCR',
      unitOfSpeed: 'km/h',
    },
  };

  if (!results) {
    return null;
  }

  return (
    <View style={ClassNames.Results}>
      <View style={ClassNames.Confetti}>
        <ConfettiCannon
          count={30}
          fallSpeed={10000}
          origin={{ x: 0, y: -600 }}
        />
      </View>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsTitle}>
          Your{' '}
          <Text style={ClassNames.ResultsCarName}>
            {currentProfile?.vehicleName}
          </Text>{' '}
          took
        </Text>
      </View>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsTime}>{results.time}</Text>
        <Text style={ClassNames.ResultsSeconds}>seconds</Text>
      </View>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsTo}>to</Text>
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

function CurrentTimer({
  time,
  message,
  results,
}: Pick<ReturnType<typeof useSpeedTest>, 'message' | 'results' | 'time'>) {
  if (message || results) {
    return null;
  }

  if (!time) {
    return null;
  }

  return (
    <View style={ClassNames.Results}>
      <View style={ClassNames.ResultsRow}>
        <Text style={ClassNames.ResultsTime}>{time}</Text>
        <Text style={ClassNames.ResultsSeconds}>seconds</Text>
      </View>
    </View>
  );
}

function Message({
  message,
}: Pick<ReturnType<typeof useSpeedTest>, 'message'>) {
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
