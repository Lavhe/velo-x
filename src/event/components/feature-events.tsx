/* eslint-disable jsx-a11y/accessible-emoji */
import {tw} from 'velo-x/theme';
import {LocationPinIcon, MapSearchIcon, PlusIcon} from 'velo-x/icons';
import {
  Image,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import {useState} from 'react';
import {useEvents} from '../hooks/useEvents';
import {Loader, TopBar} from 'velo-x/ui';
import {useUserContext} from 'velo-x/auth';
import {useNavigation} from '@react-navigation/native';

export function EventsPage() {
  const {upcomingEvents, popularEvents, loading, error} = useEvents();

  if (loading) {
    return (
      <View
        style={tw`h-screen w-screen justify-center items-center bg-gray-950`}>
        <Loader />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={tw`h-screen w-screen justify-center items-center bg-gray-950`}>
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

function Content({upcomingEvents, popularEvents}: Props) {
  const [scrollOffsetY, setScrollOffsetY] = useState(0);
  const {currentUser} = useUserContext();
  const {navigate} = useNavigation();

  console.log('Rerender');
  return (
    <View style={tw`flex h-full text-white bg-gray-950`}>
      <TopBar title="Events" scrollOffsetY={scrollOffsetY}>
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
        {!currentUser?.anonymous && (
          <TouchableOpacity
            onPress={() =>
              navigate({
                name: 'CreateEvent',
              } as never)
            }
            style={tw`rounded-lg bg-gray-950 p-3 h-full`}>
            <PlusIcon style={tw`h-7 w-7 text-white`} />
          </TouchableOpacity>
        )}
      </TopBar>

      <ScrollView
        style={tw`flex-1 gap-4 z-5 border-t-full`}
        onScroll={({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => setScrollOffsetY(y)}>
        <View style={tw`w-full z-10 p-4 bg-gray-950`}>
          <Text style={tw`font-bold text-xl text-primary my-4`}>
            Popular Events 🔥
          </Text>

          <ScrollView horizontal style={tw`flex gap-10`}>
            {popularEvents.map((data, key) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigate({
                      name: 'Event',
                      params: {id: data.id},
                    } as never)
                  }
                  key={key}
                  style={tw`gap-4 w-[70vw] relative py-6 px-4 align-center`}>
                  <View style={tw`h-52 w-52 relative`}>
                    <Image
                      source={{uri: data.poster}}
                      style={tw`h-full w-full rounded-md`}
                    />

                    <View
                      style={tw`absolute -bottom-2 right-4 py-px font-bold flex-initial ${
                        data.entranceFees.length ? 'bg-red-600' : 'bg-red-400'
                      } rounded-full px-2 gap-4`}>
                      <Text
                        style={tw`font-bold flex-initial rounded-full px-2 gap-4 text-white`}>
                        {data.entranceFees.length
                          ? `From R${
                              data.entranceFees.sort(
                                (a, b) => a.amount - b.amount,
                              )[0]?.amount
                            }`
                          : 'Free'}
                      </Text>
                    </View>
                  </View>
                  <View style={tw`flex flex-row`}>
                    <View style={tw`flex gap-2`}>
                      <Text style={tw`font-bold text-white text-xl`}>
                        {data.title}
                      </Text>
                      <Text style={tw`font-light text-white text-md`}>
                        {moment(data.startDate).format('dddd, DD MMMM YYYY')}
                      </Text>

                      <Text
                        style={tw`font-thin gap-4 text-white my-auto text-md`}>
                        <LocationPinIcon
                          style={tw`h-4 w-4 my-auto text-white`}
                        />
                        {data.location.address?.name}{' '}
                        {data.location.address?.streetName}{' '}
                        {data.location.address?.city}{' '}
                        {data.location.address?.state}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <Text style={tw`font-bold text-xl text-primary my-4`}>
            Upcoming Events 🥳
          </Text>
          {upcomingEvents.map((data, key) => (
            <TouchableOpacity
              onPress={() =>
                navigate({
                  name: 'Event',
                  params: {id: data.id},
                } as never)
              }
              key={key}
              style={tw`flex relative flex-row my-4 gap-4 w-full`}>
              <View style={tw`h-32 w-32 relative`}>
                <Image
                  source={{uri: data.poster, width: 120, height: 120}}
                  resizeMode="cover"
                  style={tw`rounded-md`}
                />

                <View
                  style={tw`absolute bottom-2 right-2 py-px font-bold text-sm flex-initial ${
                    data.entranceFees.length ? 'bg-red-600' : 'bg-red-400'
                  } rounded-full px-2 gap-4`}>
                  <Text
                    style={tw`font-bold flex-initial rounded-full px-2 gap-4 text-white`}>
                    {data.entranceFees.length
                      ? `From R${
                          data.entranceFees.sort(
                            (a, b) => a.amount - b.amount,
                          )[0]?.amount
                        }`
                      : 'Free'}
                  </Text>
                </View>
              </View>
              <View style={tw`flex flex-col flex-1 gap-2`}>
                <Text style={tw`font-bold text-white text-xl`}>
                  {data.title}
                </Text>
                <View style={tw`my-auto flex-1`}>
                  <Text style={tw`font-light text-white text-md`}>
                    {moment(data.startDate).format('dddd, DD MMMM YYYY')}
                  </Text>
                  <Text style={tw`font-thin text-white my-auto text-md`}>
                    <LocationPinIcon style={tw`h-4 w-4 my-auto text-white`} />
                    {data.location.address?.name}{' '}
                    {data.location.address?.streetName}{' '}
                    {data.location.address?.city} {data.location.address?.state}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
