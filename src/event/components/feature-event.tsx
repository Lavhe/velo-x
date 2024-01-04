/* eslint-disable jsx-a11y/accessible-emoji */
import {tw} from 'velo-x/theme';
import {
  LocationPinIcon,
  MapSearchIcon,
  PencilIcon,
  PlusIcon,
} from 'velo-x/icons';
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
import {Loader, TopBar} from 'velo-x/ui';
import {useUserContext} from 'velo-x/auth';
import {Collections, useDocument} from 'velo-x/firebase';
import {schema, Type as EventType} from '../schema';

export function EventPage({route}: any) {
  const id = route.params?.id || '';
  console.log('In event page', id);
  const {data, error, loading} = useDocument(schema, Collections.EVENTS, id);

  if (loading) {
    return (
      <View
        style={tw`h-screen w-screen justify-center items-center bg-gray-950`}>
        <Loader />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View
        style={tw`h-screen w-screen justify-center items-center bg-gray-950`}>
        <Text style={tw`text-red-600 font-semibold text-sm`}>
          {error || 'Failed to load data'}
        </Text>
      </View>
    );
  }

  return <Content data={data} />;
}

interface Props {
  data: EventType;
}

function Content({data}: Props) {
  const [scrollOffsetY, setScrollOffsetY] = useState(0);
  const {currentUser} = useUserContext();

  console.log('Rerender');
  return (
    <View style={tw`flex h-full text-white bg-gray-950`}>
      <TopBar title="Events" scrollOffsetY={scrollOffsetY}>
        {currentUser?.id === data.user && (
          <View style={tw`flex flex-row gap-4`}>
            <TouchableOpacity
              style={tw`rounded-full border bg-gray-900 flex-row items-center gap-2 px-4 py-2 h-full`}>
              <Text style={tw`text-white text-xs`}>Edit</Text>
              <PencilIcon style={tw`h-4 w-4 text-white`} />
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`rounded-full flex-row items-center gap-2 bg-gray-900 px-4 py-2 h-full`}>
              <Text style={tw`text-white text-xs`}>Delete</Text>
              <PencilIcon style={tw`h-4 w-4 text-white`} />
            </TouchableOpacity>
          </View>
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
            {data.title}
          </Text>

          <ScrollView style={tw`flex gap-10`}>
            <View style={tw`gap-4 w-full align-center rounded-md`}>
              <Image
                source={{uri: data.poster}}
                style={tw`h-52 w-full rounded-md`}
                resizeMode="cover"
              />
              <View style={tw`flex flex-row`}>
                <View style={tw`flex gap-2`}>
                  <Text style={tw`font-light text-white text-md`}>
                    {moment(data.startDate).format('dddd, DD MMMM YYYY')}
                  </Text>

                  <Text style={tw`font-thin gap-4 text-white my-auto text-md`}>
                    <LocationPinIcon style={tw`h-4 w-4 my-auto text-white`} />{' '}
                    {data.location.address?.name}{' '}
                    {data.location.address?.streetName}{' '}
                    {data.location.address?.city} {data.location.address?.state}
                  </Text>
                </View>
              </View>
              <Text style={tw`font-semibold text-white py-4`}>
                {!Boolean(data.entranceFees.length) && (
                  <Text
                    style={tw`font-black flex-initial rounded-full text-red-400 px-2 gap-4`}>
                    Free{' '}
                  </Text>
                )}
                Entrance
              </Text>
              <View style={tw`flex gap-2`}>
                {data.entranceFees?.map((fee, i) => (
                  <View style={tw`flex flex-row gap-2 px-4`}>
                    <Text style={tw`font-semibold text-white text-sm`}>
                      {i + 1}. {fee.label} :
                    </Text>
                    <Text style={tw`font-black text-white text-sm`}>
                      R{fee.amount}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
