import { tw } from 'theme';
import { Image, Text, View, ScrollView, TouchableOpacity } from 'react-native';

// Replace the name variable below with valid name
const data = [
  {
    name: 'John Doe',
    time: '9',
    pic: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
    car: 'Mercedes-benz A45',
  },
  {
    name: 'Glen Mudau',
    time: '9.1',
    pic: 'https://www.carlogos.org/car-logos/volkswagen-logo.png',
    car: 'Golf GTI TCR',
  },
  {
    name: 'Joseph Sirwali',
    time: '9.2',
    pic: 'https://www.carlogos.org/car-logos/opel-logo.png',
    car: 'Opel corsa 1.7DTI',
  },
  {
    name: 'Netshedzo Nenguda',
    time: '18',
    pic: 'https://www.carlogos.org/car-logos/audi-logo.png',
    car: 'Audi S3',
  },
  {
    name: 'Smith Doe',
    time: '10',
    pic: 'https://www.carlogos.org/car-logos/nissan-logo.png',
    car: 'Nissan GTR',
  },
  {
    name: 'Terry Ndou',
    time: '11',
    pic: 'https://www.carlogos.org/car-logos/audi-logo.png',
    car: 'Audi TTrs',
  },
  {
    name: 'Glen Mudau',
    time: '16',
    pic: 'https://www.carlogos.org/car-logos/bmw-logo.png',
    car: 'BMW M3',
  },
  {
    name: 'Netshedzo Nenguda',
    time: '18',
    pic: 'https://www.carlogos.org/car-logos/audi-logo.png',
    car: 'Audi S3',
  },
  {
    name: 'Livhuwani Matsigila',
    time: '22',
    pic: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
    car: 'Mercedes-benz A45',
  },
  {
    name: 'Ramaanda Daswa',
    time: '36',
    pic: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png',
    car: 'Mercedes-benz A45',
  },
  {
    name: 'Glen Mudau',
    time: '40',
    pic: 'https://www.carlogos.org/car-logos/volkswagen-logo.png',
    car: 'Golf GTI TCR',
  },
  {
    name: 'Joseph Sirwali',
    time: '9.2',
    pic: 'https://www.carlogos.org/car-logos/opel-logo.png',
    car: 'Opel corsa 1.7DTI',
  },
  {
    name: 'Glen Mudau',
    time: '9.2',
    pic: 'https://www.carlogos.org/car-logos/bmw-logo.png',
    car: 'BMW M3',
  },
  {
    name: 'Imani Roswika',
    time: '9.2',
    pic: 'https://www.carlogos.org/car-logos/audi-logo.png',
    car: 'Audi S3',
  },
  {
    name: 'Thifarwa Gidimani',
    time: '9.2',
    pic: 'https://www.carlogos.org/car-logos/bmw-logo.png',
    car: 'BMW M4',
  },
];

export function LeaderboardPage() {
  return (
    <View style={tw`flex h-full text-white bg-gray-950 mt-10`}>
      <Text style={tw`font-bold text-4xl text-white my-6 px-3 py-4`}>
        Leaderboard
      </Text>
      <View style={tw`flex-row`}>
        <View
          style={tw`flex-1 mx-auto bg-primary shadow-lg bg-opacity-10 pt-4`}
        >
          <Image
            source={{ uri: data[1].pic }}
            style={tw`h-16 w-16 rounded-full mx-auto`}
          />
          <Text
            style={tw`text-white font-semibold text-center font-semibold py-1`}
          >
            {data[1].name}
          </Text>
          <Text
            style={tw`rounded-full text-white text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full whitespace-nowrap`}
          >
            {data[1].time}s
          </Text>

          <Text style={tw`text-white text-center text-5xl font-black py-4`}>
            2
          </Text>
        </View>
        <View style={tw`flex-1 mx-auto bg-primary bg-opacity-20 pt-12`}>
          <Image
            source={{ uri: data[0].pic }}
            style={tw`h-20 w-20 rounded-full mx-auto`}
          />
          <Text
            style={tw`text-white font-semibold text-center font-semibold py-1`}
          >
            {data[0].name}
          </Text>
          <Text
            style={tw`text-white text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full whitespace-nowrap`}
          >
            {data[0].time}s
          </Text>

          <Text style={tw`text-white text-center text-8xl font-black pt-4`}>
            1
          </Text>
        </View>
        <View style={tw`flex-1 mx-auto bg-primary bg-opacity-5 pt-4`}>
          <Image
            source={{ uri: data[2].pic }}
            style={tw`h-12 w-12 rounded-full mx-auto`}
          />
          <Text
            style={tw`text-white font-semibold text-center font-semibold py-1`}
          >
            {data[2].name}
          </Text>
          <Text
            style={tw`text-white text-xs font-black mx-10 py-0.5 text-center bg-opacity-80  bg-gray-900 rounded-full whitespace-nowrap`}
          >
            {data[2].time}s
          </Text>

          <Text style={tw`text-white text-center text-4xl font-black py-4`}>
            3
          </Text>
        </View>
      </View>
      <ScrollView style={tw`flex-1 gap-4 shadow-md bg-gray-950`}>
        {data
          .slice(3)
          .sort((a, b) => (a.time > b.time ? -1 : 1))
          .map((value, i) => (
            <View style={tw`flex-row relative py-0.5 w-full`}>
              <View
                style={tw`h-full w-[${
                  100 -
                  (Math.abs(value.time - data[0].time) / data[0].time / 2) * 100
                }%] bg-primary bg-opacity-10 border-r-4 border-primary absolute rounded-r-xl`}
              />
              <View
                style={tw`flex-row relative shadow-sm gap-4 py-4 px-4 items-center w-full`}
                key={i}
              >
                <Text style={tw`text-white text-sm`}>{i + 4}</Text>

                <Image
                  source={{ uri: value.pic }}
                  style={tw`h-10 w-10 rounded-full mx-auto`}
                />
                <View style={tw`flex-1 font-semibold`}>
                  <Text style={tw`text-white font-semibold`}>{value.name}</Text>
                  <Text style={tw`text-white text-sm font-light`}>
                    {value.car}
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
      </ScrollView>
    </View>
  );
}
