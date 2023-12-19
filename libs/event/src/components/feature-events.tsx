/* eslint-disable jsx-a11y/accessible-emoji */
import { tw } from 'theme';
import { LocationPinIcon, MapSearchIcon } from 'icons';
import {
  Image,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Loader } from 'ui';

export function EventsPage() {
  const { upcomingEvents, popularEvents, loading, error } = useEvents();

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
    <Content upcomingEvents={upcomingEvents} popularEvents={popularEvents} />
  );
}

interface Props {
  upcomingEvents: ReturnType<typeof useEvents>['upcomingEvents'];
  popularEvents: ReturnType<typeof useEvents>['popularEvents'];
}

function Content({ upcomingEvents, popularEvents }: Props) {
  const [scrollOffsetY, setScrollOffsetY] = useState(0);

  console.log('Rerender');
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
            Events
          </Text>
          <View style={tw`flex flex-row gap-6`}>
            <View style={tw`relative my-auto place-items-center w-[80%]`}>
              <TextInput
                keyboardType="web-search"
                placeholderTextColor={'#6b7280'}
                style={tw`rounded-lg border border-gray-700/50 bg-gray-950 w-full px-4 text-md h-14 pl-14 text-white`}
                placeholder="Find amazing events"
              />
              <MapSearchIcon
                style={tw`h-6 w-6 absolute text-white top-0 my-auto left-4 top-4`}
              />
            </View>
            <TouchableOpacity style={tw`rounded-lg bg-gray-950 p-3 h-full`}>
              <LocationPinIcon style={tw`h-7 w-7 text-white`} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={tw`flex-1 gap-4 z-5 border-t-full ${
          scrollOffsetY < 44 ? 'pt-' + (44 - scrollOffsetY) : ''
        }`}
        onScroll={({
          nativeEvent: {
            contentOffset: { y },
          },
        }) => setScrollOffsetY(y)}
      >
        <View style={tw`w-full z-10 p-4 bg-gray-950`}>
          <Text style={tw`font-bold text-xl text-primary my-4`}>
            Popular Events 🔥
          </Text>

          <ScrollView horizontal style={tw`flex gap-10`}>
            {popularEvents.map((data, key) => {
              return (
                <View
                  key={key}
                  style={tw`gap-4 w-[70vw] py-6 px-4 align-center`}
                >
                  <Image
                    source={{ uri: data.poster }}
                    style={tw`h-52 w-52 rounded-md`}
                  />
                  <View style={tw`flex flex-row`}>
                    <View style={tw`flex gap-2`}>
                      <Text
                        style={tw`font-bold text-white text-xl whitespace-nowrap`}
                      >
                        {data.title}
                      </Text>
                      <Text style={tw`font-light text-white text-md`}>
                        {moment(data.startDate).format('dddd, DD MMMM YYYY')}
                      </Text>

                      <Text
                        style={tw`font-thin gap-4 text-white my-auto text-md`}
                      >
                        <LocationPinIcon
                          style={tw`h-4 w-4 my-auto text-white`}
                        />{' '}
                        {data.location.address}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <Text style={tw`font-bold text-xl text-primary my-4`}>
            Upcoming Events 🥳
          </Text>
          {upcomingEvents.map((data, key) => (
            <View key={key} style={tw`flex flex-row my-4 gap-4`}>
              <Image
                source={{ uri: data.poster }}
                style={tw`h-32 w-32 rounded-md`}
              />
              <View style={tw`flex flex-col gap-2`}>
                <Text style={tw`font-bold text-white text-xl w-full`}>
                  {data.title}
                </Text>
                <View style={tw`my-auto`}>
                  <Text style={tw`font-light text-white text-md`}>
                    {moment(data.startDate).format('dddd, DD MMMM YYYY')}
                  </Text>
                  <Text style={tw`font-thin gap-4 text-white my-auto text-md`}>
                    {data.location.address}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
