import { tw } from 'theme';
import {
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { MapSearchIcon } from 'icons';
import { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { DriveOptions } from '../schema';
import { Loader } from 'ui';

// Replace the name variable below with valid name
// const data = [
//   {
//     name: 'John Doe',
//     time: '9',
//     pic: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
//     car: 'Mercedes-benz A45',
//   },
//   {
//     name: 'Glen Mudau',
//     time: '9.1',
//     pic: 'https://www.carlogos.org/car-logos/volkswagen-logo.png',
//     car: 'Golf GTI TCR',
//   },
//   {
//     name: 'Joseph Sirwali',
//     time: '9.2',
//     pic: 'https://www.carlogos.org/car-logos/opel-logo.png',
//     car: 'Opel corsa 1.7DTI',
//   },
//   {
//     name: 'Netshedzo Nenguda',
//     time: '18',
//     pic: 'https://www.carlogos.org/car-logos/audi-logo.png',
//     car: 'Audi S3',
//   },
//   {
//     name: 'Smith Doe',
//     time: '10',
//     pic: 'https://www.carlogos.org/car-logos/nissan-logo.png',
//     car: 'Nissan GTR',
//   },
//   {
//     name: 'Terry Ndou',
//     time: '11',
//     pic: 'https://www.carlogos.org/car-logos/audi-logo.png',
//     car: 'Audi TTrs',
//   },
//   {
//     name: 'Glen Mudau',
//     time: '16',
//     pic: 'https://www.carlogos.org/car-logos/bmw-logo.png',
//     car: 'BMW M3',
//   },
//   {
//     name: 'Netshedzo Nenguda',
//     time: '18',
//     pic: 'https://www.carlogos.org/car-logos/audi-logo.png',
//     car: 'Audi S3',
//   },
//   {
//     name: 'Livhuwani Matsigila',
//     time: '22',
//     pic: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
//     car: 'Mercedes-benz A45',
//   },
//   {
//     name: 'Ramaanda Daswa',
//     time: '36',
//     pic: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
//     car: 'Mercedes-benz A45',
//   },
//   {
//     name: 'Glen Mudau',
//     time: '40',
//     pic: 'https://www.carlogos.org/car-logos/volkswagen-logo.png',
//     car: 'Golf GTI TCR',
//   },
//   {
//     name: 'Joseph Sirwali',
//     time: '9.2',
//     pic: 'https://www.carlogos.org/car-logos/opel-logo.png',
//     car: 'Opel corsa 1.7DTI',
//   },
//   {
//     name: 'Glen Mudau',
//     time: '9.2',
//     pic: 'https://www.carlogos.org/car-logos/bmw-logo.png',
//     car: 'BMW M3',
//   },
//   {
//     name: 'Imani Roswika',
//     time: '9.2',
//     pic: 'https://www.carlogos.org/car-logos/audi-logo.png',
//     car: 'Audi S3',
//   },
//   {
//     name: 'Thifarwa Gidimani',
//     time: '9.2',
//     pic: 'https://www.carlogos.org/car-logos/bmw-logo.png',
//     car: 'BMW M4',
//   },
// ];

export function LeaderboardPage() {
  const [filter, setFilter] = useState<DriveOptions>('quarter-mile');
  const { leaderboard, first, second, third, loading, error } = useLeaderboard({
    filter,
  });

  if (loading) {
    return (
      <View
        style={tw`h-screen w-screen justify-center items-center bg-primary`}
      >
        <Loader />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={tw`h-screen w-screen justify-center items-center bg-primary`}
      >
        <Text style={tw`text-red-600 font-semibold text-sm`}>{error}</Text>
      </View>
    );
  }

  return (
    <Content {...{ filter, setFilter, leaderboard, first, second, third }} />
  );
}

interface Props {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<DriveOptions>>;
  leaderboard: ReturnType<typeof useLeaderboard>['leaderboard'];
  first: ReturnType<typeof useLeaderboard>['first'];
  second: ReturnType<typeof useLeaderboard>['second'];
  third: ReturnType<typeof useLeaderboard>['third'];
}

export function Content({
  filter,
  setFilter,
  leaderboard,
  first,
  second,
  third,
}: Props) {
  const [scrollOffsetY, setScrollOffsetY] = useState(0);

  return (
    <View
      style={tw`flex h-full text-white ${
        scrollOffsetY === 0 ? 'bg-primary' : 'bg-gray-950'
      }`}
    >
      <View
        style={tw`flex-row absolute z-10 top-0 p-4 my-auto pb-6 place-items-center justify-around ${
          scrollOffsetY === 0 ? 'bg-primary' : 'bg-gray-950'
        } border-b-full`}
      >
        <View style={tw`flex flex-col px-2 h-auto w-full`}>
          <Text
            style={tw`font-bold text-4xl text-white my-6 transform duration-300 ease-in-out ${
              scrollOffsetY > 2 ? 'hidden' : 'flex'
            }`}
          >
            Leader board
          </Text>
          <View style={tw`flex flex-row gap-6`}>
            <View style={tw`relative my-auto place-items-center w-grow`}>
              <TextInput
                keyboardType="web-search"
                placeholderTextColor={'#6b7280'}
                style={tw`rounded-lg border border-gray-700/50 bg-gray-950 w-full px-4 text-md h-14 pl-14 text-white`}
                placeholder="Search car/driver"
              />
              <MapSearchIcon
                style={tw`h-6 w-6 absolute text-white top-0 my-auto left-4 top-4`}
              />
            </View>
            <FilterDialog filter={filter} setFilter={setFilter} />
          </View>
        </View>
      </View>
      <ScrollView
        style={tw`flex-1 gap-4 z-5 border-t-full h-full  ${
          scrollOffsetY < 44 ? 'pt-' + (44 - scrollOffsetY) : ''
        }`}
        onScroll={({
          nativeEvent: {
            contentOffset: { y },
          },
        }) => setScrollOffsetY(y)}
      >
        <View style={tw`flex h-full text-white bg-gray-950`}>
          <View style={tw`flex-row`}>
            {second && (
              <View
                style={tw`flex-1 mx-auto bg-primary shadow-lg bg-opacity-10 pt-4`}
              >
                <Image
                  source={{ uri: second.logo }}
                  style={tw`h-16 w-16 rounded-full mx-auto`}
                />
                <Text
                  style={tw`text-white font-semibold text-center font-semibold py-1`}
                >
                  {second.vehicleName}
                </Text>
                <Text
                  style={tw`rounded-full text-white text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full whitespace-nowrap`}
                >
                  {second.time}s
                </Text>

                <Text
                  style={tw`text-white text-center text-5xl font-black py-4`}
                >
                  2
                </Text>
              </View>
            )}
            {first && (
              <View style={tw`flex-1 mx-auto bg-primary bg-opacity-20 pt-12`}>
                <Image
                  source={{ uri: first.logo }}
                  style={tw`h-20 w-20 rounded-full mx-auto`}
                />
                <Text
                  style={tw`text-white font-semibold text-center font-semibold py-1`}
                >
                  {first.vehicleName}
                </Text>
                <Text
                  style={tw`text-white text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full whitespace-nowrap`}
                >
                  {first.time}s
                </Text>

                <Text
                  style={tw`text-white text-center text-8xl font-black pt-4`}
                >
                  1
                </Text>
              </View>
            )}
            {third && (
              <View style={tw`flex-1 mx-auto bg-primary bg-opacity-5 pt-4`}>
                <Image
                  source={{ uri: third.logo }}
                  style={tw`h-12 w-12 rounded-full mx-auto`}
                />
                <Text
                  style={tw`text-white font-semibold text-center font-semibold py-1`}
                >
                  {third.vehicleName}
                </Text>
                <Text
                  style={tw`text-white text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full whitespace-nowrap`}
                >
                  {third.time}s
                </Text>

                <Text
                  style={tw`text-white text-center text-4xl font-black py-4`}
                >
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
                  key={i}
                >
                  <Text style={tw`text-white text-sm`}>{i + 4}</Text>

                  <Image
                    source={{ uri: value.logo }}
                    style={tw`h-10 w-10 rounded-full mx-auto`}
                  />
                  <View style={tw`flex-1 font-semibold`}>
                    <Text style={tw`text-white font-semibold`}>
                      {value.driverName}
                    </Text>
                    <Text style={tw`text-white text-sm font-light`}>
                      {value.vehicleName}
                    </Text>
                  </View>
                  <Text
                    style={tw`text-gray-100 text-xs font-bold my-auto rounded-full px-2`}
                  >
                    {value.time} seconds
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const options = [
  { value: 'half-quarter-mile', label: 'Half quarter mile' },
  { value: 'quarter-mile', label: 'Quarter mile' },
  { value: 'mile', label: 'Mile' },
  { value: '0-to-100', label: '0 to 100km/h' },
  { value: '0-to-200', label: '0 to 200km/h' },
  { value: '30-to-100', label: '30km/h to 100km/h' },
  { value: 'brake', label: 'Brake' },
] as const;

function FilterDialog({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<DriveOptions>>;
}) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        onRequestClose={() => {
          setShow(!show);
        }}
      >
        <View
          style={tw`h-screen w-screen justify-center items-center bg-gray-950 bg-opacity-70`}
        >
          <View style={tw`flex shadow-lg bg-gray-900 w-2/3 h-1/2`}>
            <Text style={tw`font-bold text-lg p-4`}>Filter</Text>
            <View>
              {options.map((option) => (
                <TouchableOpacity
                  style={tw`flex-row justify-between items-center p-4`}
                  key={option.value}
                  onPress={() => {
                    setFilter(option.value);
                    setShow(false);
                  }}
                >
                  <Text>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={tw`rounded-lg p-3 gap-2 h-full flex-row justify-between items-center`}
        onPress={() => setShow(true)}
      >
        <Text style={tw`text-gray-950`}>
          {options.find((o) => o.value === filter)?.label || '???'}
        </Text>
      </TouchableOpacity>
    </>
  );
}
