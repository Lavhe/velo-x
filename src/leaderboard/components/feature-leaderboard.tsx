import {tw} from 'velo-x/theme';
import {
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import {FilterIcon, MapSearchIcon, WheelDriveIcon} from 'velo-x/icons';
import {useState} from 'react';
import {useLeaderboard} from '../hooks/useLeaderboard';
import {DriveOptions} from 'velo-x/drive';
import {Loader, SingleSelect, TopBar} from 'velo-x/ui';
import {convertToSentenceCase} from 'velo-x/utils';
import {wheelDriveSchema} from 'velo-x/profile';

export function LeaderboardPage() {
  const leaderboard = useLeaderboard();
  const {loading} = leaderboard;

  if (loading) {
    return (
      <View
        style={tw`h-screen w-screen justify-center items-center bg-gray-950`}>
        <Loader />
      </View>
    );
  }

  return <Content {...leaderboard} />;
}

type Props = ReturnType<typeof useLeaderboard>;

export function Content({
  filter,
  setFilter,
  leaderboard,
  first,
  second,
  third,
  error,
}: Props) {
  const [scrollOffsetY, setScrollOffsetY] = useState(0);

  return (
    <View style={tw`flex h-full text-white bg-gray-950`}>
      <TopBar title="Leader board" scrollOffsetY={scrollOffsetY}>
        <View style={tw`items-center gap-2 flex-row w-full`}>
          <SingleSelect
            value={filter?.wheelDrive ?? 'Any'}
            onChange={value => setFilter(p => ({...p, wheelDrive: value}))}
            items={Object.values(wheelDriveSchema.Values)
              .map(value => ({
                value,
                label: (
                  <View style={tw`items-center flex gap-4`}>
                    <WheelDriveIcon
                      style={tw`h-8 w-8 text-primary`}
                      wheelDrive={value}
                    />
                    <Text style={tw`text-center text-xs text-white`}>
                      {convertToSentenceCase(value)}
                    </Text>
                  </View>
                ),
              }))
              .concat([
                {
                  value: 'Any' as any,
                  label: (
                    <View style={tw`items-center flex gap-4`}>
                      <Text style={tw`text-center text-xs text-white`}>
                        Any
                      </Text>
                    </View>
                  ),
                },
              ])}
            Icon={() => (
              <WheelDriveIcon
                style={tw`h-6 w-6 absolute text-primary my-auto left-3 top-3`}
                wheelDrive={filter?.wheelDrive ?? 'Any'}
              />
            )}
          />
          <View style={tw`flex-1`}>
            <SingleSelect
              items={options.map(option => ({
                value: option.value,
                label: (
                  <Text style={tw`text-white font-semibold`}>
                    {option.label}
                  </Text>
                ),
              }))}
              value={filter.driveOption}
              onChange={value => setFilter(p => ({...p, driveOption: value}))}
              Icon={FilterIcon}
            />
          </View>
        </View>
      </TopBar>

      {!first && (
        <Text
          style={tw`text-white text-center my-auto h-full flex-1 font-semibold`}>
          No results for {convertToSentenceCase(filter.wheelDrive)}{' '}
          {convertToSentenceCase(filter.driveOption)}
        </Text>
      )}
      {error ? (
        <Text
          style={tw`text-red-600 font-semibold my-auto h-full flex-1 text-sm`}>
          {error || 'Failed to load data'}
        </Text>
      ) : (
        <ScrollView
          style={tw`flex-1 gap-4 z-5 border-t-full h-full`}
          onScroll={({
            nativeEvent: {
              contentOffset: {y},
            },
          }) => setScrollOffsetY(y)}>
          <View style={tw`flex h-full text-white bg-gray-950`}>
            <View style={tw`flex-row`}>
              {second && (
                <View
                  style={tw`flex-1 mx-auto bg-primary shadow-lg bg-opacity-10 pt-4`}>
                  <View
                    style={tw`h-16 w-16 rounded-full mx-auto items-center bg-white p-1`}>
                    <Image
                      source={{uri: second.logo}}
                      resizeMode="contain"
                      style={tw`h-full w-full rounded-full mx-auto`}
                    />
                  </View>
                  <Text
                    style={tw`text-white font-semibold text-center font-semibold py-1`}>
                    {second.vehicleName}
                  </Text>
                  <Text
                    style={tw`rounded-full text-white text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full whitespace-nowrap`}>
                    {second.time}s
                  </Text>

                  <Text
                    style={tw`text-white text-center text-5xl font-black py-4`}>
                    2
                  </Text>
                </View>
              )}
              {first && (
                <View style={tw`flex-1 mx-auto bg-primary bg-opacity-20 pt-12`}>
                  <View
                    style={tw`h-20 w-20 rounded-full mx-auto items-center bg-white p-1`}>
                    <Image
                      source={{uri: first.logo}}
                      resizeMode="contain"
                      style={tw`h-full w-full rounded-full mx-auto`}
                    />
                  </View>
                  <Text
                    style={tw`text-white font-semibold text-center font-semibold py-1`}>
                    {first.vehicleName}
                  </Text>
                  <Text
                    style={tw`text-white text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full whitespace-nowrap`}>
                    {first.time}s
                  </Text>

                  <Text
                    style={tw`text-white text-center text-8xl font-black pt-4`}>
                    1
                  </Text>
                </View>
              )}
              {third && (
                <View style={tw`flex-1 mx-auto bg-primary bg-opacity-5 pt-4`}>
                  <View
                    style={tw`h-12 w-12 rounded-full mx-auto items-center bg-white p-1`}>
                    <Image
                      source={{uri: third.logo}}
                      resizeMode="contain"
                      style={tw`h-full w-full rounded-full mx-auto`}
                    />
                  </View>
                  <Text
                    style={tw`text-white font-semibold text-center font-semibold py-1`}>
                    {third.vehicleName}
                  </Text>
                  <Text
                    style={tw`text-white text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full whitespace-nowrap`}>
                    {third.time}s
                  </Text>

                  <Text
                    style={tw`text-white text-center text-4xl font-black py-4`}>
                    3
                  </Text>
                </View>
              )}
            </View>

            <View style={tw`shadow-md bg-gray-950`}>
              {leaderboard.map((value, i) => (
                <View key={i} style={tw`flex-row relative py-0.5 w-full`}>
                  <View
                    style={tw`h-full w-[${
                      100 -
                      (Math.abs(value.time - third.time) / third.time / 2) * 100
                    }%] bg-primary bg-opacity-10 border-r-4 border-primary absolute rounded-r-xl`}
                  />
                  <View
                    style={tw`flex-row relative shadow-sm gap-4 py-4 px-4 items-center w-full`}
                    key={i}>
                    <Text style={tw`text-white text-sm`}>{i + 4}</Text>

                    <View
                      style={tw`h-12 w-12 rounded-full mx-auto items-center bg-white p-1`}>
                      <Image
                        source={{uri: value.logo}}
                        resizeMode="contain"
                        style={tw`h-full w-full rounded-full mx-auto`}
                      />
                    </View>
                    <View style={tw`flex-1 font-semibold`}>
                      <Text style={tw`text-white font-semibold`}>
                        {value.vehicleName}
                      </Text>
                      <Text style={tw`text-white text-sm font-light`}>
                        {value.driverName}
                      </Text>
                    </View>
                    <Text
                      style={tw`text-gray-100 text-xs font-bold my-auto rounded-full px-2`}>
                      {value.time} seconds
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const options = Object.values(DriveOptions).map(value => ({
  value,
  label: convertToSentenceCase(value),
}));
