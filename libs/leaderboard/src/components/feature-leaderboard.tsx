import { tw } from 'theme';
import { Image, Text, View, ScrollView } from 'react-native';

const data = [
  {
    name: 'Test test 1',
    time: '9',
    pic: 'https://i.pravatar.cc/99',
    car: 'Mercedes-benz A45',
  },
  {
    name: 'Test test 2',
    time: '10',
    pic: 'https://i.pravatar.cc/62',
    car: 'Nissan GTR',
  },
  {
    name: 'Test test 3',
    time: '11',
    pic: 'https://i.pravatar.cc/68',
    car: 'Audi TTrs',
  },
  {
    name: 'Test test 4',
    time: '16',
    pic: 'https://i.pravatar.cc/60',
    car: 'BMW M3',
  },
  {
    name: 'Test test 5',
    time: '18',
    pic: 'https://i.pravatar.cc/62',
    car: 'Audi S3',
  },
  {
    name: 'Test test 6',
    time: '22',
    pic: 'https://i.pravatar.cc/68',
    car: 'Mercedes-benz A45',
  },
  {
    name: 'Test test 1',
    time: '36',
    pic: 'https://i.pravatar.cc/60',
    car: 'Mercedes-benz A45',
  },
  {
    name: 'Test test 2',
    time: '40',
    pic: 'https://i.pravatar.cc/62',
    car: 'Golf GTI TCR',
  },
  {
    name: 'Test test 3',
    time: '9.2',
    pic: 'https://i.pravatar.cc/68',
    car: 'Opel corsa 1.7DTI',
  },
  {
    name: 'Test test 4',
    time: '9.2',
    pic: 'https://i.pravatar.cc/60',
    car: 'BMW M3',
  },
  {
    name: 'Test test 5',
    time: '9.2',
    pic: 'https://i.pravatar.cc/62',
    car: 'Audi S3',
  },
  {
    name: 'Test test 6',
    time: '9.2',
    pic: 'https://i.pravatar.cc/68',
    car: 'BMW M4',
  },
];

export function LeaderboardPage() {
  return (
    <View style={tw`flex h-full text-white bg-primary`}>
      <View style={tw`0 flex-row`}>
        <View style={tw`flex-1 mx-auto bg-gray-200 bg-opacity-30 pt-4`}>
          <Image
            source={{ uri: data[1].pic }}
            style={tw`h-16 w-16 rounded-full mx-auto`}
          />
          <Text style={tw`font-semibold text-center font-semibold py-1`}>
            {data[1].name}
          </Text>
          <Text
            style={tw`text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full`}
          >
            {data[1].time} seconds
          </Text>

          <Text style={tw`text-center text-5xl font-black py-4`}>2</Text>
        </View>
        <View style={tw`flex-1 mx-auto bg-gray-200 bg-opacity-40 pt-12`}>
          <Image
            source={{ uri: data[0].pic }}
            style={tw`h-20 w-20 rounded-full mx-auto`}
          />
          <Text style={tw`font-semibold text-center font-semibold py-1`}>
            {data[0].name}
          </Text>
          <Text
            style={tw`text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full`}
          >
            {data[0].time} seconds
          </Text>

          <Text style={tw`text-center text-8xl font-black pt-4`}>1</Text>
        </View>
        <View style={tw`flex-1 mx-auto bg-gray-200 bg-opacity-20 pt-4`}>
          <Image
            source={{ uri: data[3].pic }}
            style={tw`h-12 w-12 rounded-full mx-auto`}
          />
          <Text style={tw`font-semibold text-center font-semibold py-1`}>
            {data[3].name}
          </Text>
          <Text
            style={tw`text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full`}
          >
            {data[3].time} seconds
          </Text>

          <Text style={tw`text-center text-4xl font-black py-4`}>3</Text>
        </View>
      </View>
      <ScrollView style={tw`flex-1 gap-4 shadow-md bg-gray-900`}>
        {data
          .slice(3)
          .sort((a, b) => (a.time > b.time ? -1 : 1))
          .map((value, i) => (
            <View style={tw`flex-row relative py-0.5 w-full`}>
              <View
                style={tw`h-full w-[${
                  100 -
                  (Math.abs(value.time - data[0].time) / data[0].time / 2) * 100
                }%] bg-primary bg-opacity-10 absolute`}
              />
              <View
                style={tw`flex-row relative shadow-sm gap-4 py-4 px-4 items-center w-full`}
                key={i}
              >
                <Text style={tw`text-sm`}>{i + 4}</Text>

                <Image
                  source={{ uri: value.pic }}
                  style={tw`h-10 w-10 rounded-full mx-auto`}
                />
                <View style={tw`flex-1 font-semibold`}>
                  <Text style={tw`font-semibold`}>{value.name} dsfdg</Text>
                  <Text style={tw`text-sm font-light`}>{value.car}</Text>
                </View>
                <Text
                  style={tw`text-xs font-black bg-opacity-80 my-auto bg-primary text-black rounded-full px-2`}
                >
                  {value.time} seconds
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
