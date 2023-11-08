/* eslint-disable jsx-a11y/accessible-emoji */
import { tw } from 'theme';
import { LocationPinIcon, MapSearchIcon, SettingsIcon } from 'icons';
import {
  Image,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';

const popularData = [
  {
    title: 'Wicky Wednesdays at the Rock raceway',
    date: moment().add(52, 'hours').toDate(),
    pic: 'https://img.freepik.com/premium-psd/car-show-social-media-instagram-post-design-template_584197-35.jpg',
    location: 'Brakpan, Johannesburg',
  },
  {
    title: 'Amsterdam car show',
    date: moment().add(63, 'hours').toDate(),
    pic: 'https://graphicriver.img.customer.envatousercontent.com/files/304444342/Car+Show+Flyer+Preview.jpg?auto=compress%2Cformat&fit=crop&crop=top&w=590&h=590&s=b923fb5f94799a26fb6f40280248d230',
    location: 'Sunny side, Pretoria',
  },
  {
    title: 'ODI 2023 shutdown',
    date: moment().add(63, 'hours').toDate(),
    pic: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/car-show-flyer-template-a3b3e12ae6c1098232b6d3e2f1eccb0d_screen.jpg?ts=1636974494',
    location: 'Modderfontein, Johannesburg',
  },
];

const upcomingEvents = popularData
  .concat(popularData)
  .concat(popularData)
  .concat(popularData)
  .sort(() => (Math.random() > 0.5 ? 1 : -1));

export function EventsPage() {
  return (
    <View style={tw`flex h-full mt-16 text-white bg-slate-950`}>
      <ScrollView style={tw`flex-1 gap-4`}>
        <View
          style={tw`flex-row  p-4 my-auto pb-10 place-items-center justify-around`}
        >
          <View style={tw`flex flex-col h-auto w-full`}>
            <Text style={tw`font-bold text-4xl text-white my-6`}>Events</Text>
            <View style={tw`flex flex-row gap-6`}>
              <View style={tw`relative my-auto place-items-center w-[80%]`}>
                <TextInput
                  keyboardType="web-search"
                  placeholderTextColor={'#6b7280'}
                  style={tw`rounded-lg border bg-slate-800 w-full px-4 text-xl h-10 pl-14 text-white border-slate-800`}
                  placeholder="Find amazing events"
                />
                <MapSearchIcon
                  style={tw`h-7 w-7 absolute text-white top-0 my-auto left-4 top-2`}
                />
              </View>
              <TouchableOpacity
                style={tw`rounded-lg border bg-slate-800 p-2 h-full`}
              >
                <LocationPinIcon style={tw`h-6 w-6 text-white`} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={tw`w-full z-10  p-4 bg-gray-950`}>
          <Text style={tw`font-bold text-xl text-white my-4`}>
            Popular Events 🔥
          </Text>
          <ScrollView horizontal style={tw`flex gap-10`}>
            {popularData.map((data) => {
              return (
                <View style={tw`gap-4 w-[70vw] py-6 px-4 align-center`}>
                  <Image
                    source={{ uri: data.pic }}
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
                        {moment(data.date).format('dddd, DD MMMM YYYY')}
                      </Text>

                      <Text
                        style={tw`font-thin gap-4 text-white my-auto text-md`}
                      >
                        <LocationPinIcon
                          style={tw`h-4 w-4 my-auto text-white`}
                        />{' '}
                        {data.location}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <Text style={tw`font-bold text-xl text-white my-4 pt-10`}>
            Upcoming Events 🎉
          </Text>
          {upcomingEvents.map((data) => (
            <View style={tw`flex flex-row my-4 gap-4`}>
              <Image
                source={{ uri: data.pic }}
                style={tw`h-32 w-32 rounded-md`}
              />
              <View style={tw`flex flex-col gap-2`}>
                <Text style={tw`font-bold text-white text-xl w-full`}>
                  {data.title}
                </Text>
                <View style={tw`my-auto`}>
                  <Text style={tw`font-light text-white text-md`}>
                    {moment(data.date).format('dddd, DD MMMM YYYY')}
                  </Text>
                  <Text style={tw`font-thin gap-4 text-white my-auto text-md`}>
                    {data.location}
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
