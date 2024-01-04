/* eslint-disable jsx-a11y/accessible-emoji */
import {tw} from 'velo-x/theme';
import {
  LocationPinIcon,
  MapSearchIcon,
  UploadIcon,
  CloseIcon,
  PencilIcon,
} from 'velo-x/icons';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import {useEffect, useState} from 'react';
import {Input, Loader, TopBar} from 'velo-x/ui';
import {useUserContext} from 'velo-x/auth';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {schema} from '../schema';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {convertToSentenceCase} from 'velo-x/utils';
import {pickPlace} from 'react-native-place-picker';
import {EventInput, useEvent} from '../hooks/useEvent';

export function CreateEventPage({navigation}: any) {
  const [scrollOffsetY, setScrollOffsetY] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<EventInput>({});

  const {handleCreateEvent, error, loading} = useEvent({
    navigation,
  });

  const pickImage = async () => {
    try {
      const {assets} = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      const [image] = assets || [];
      if (!image) {
        return;
      }

      setCurrentEvent(p => ({
        ...p,
        poster: image,
      }));
    } catch (error) {}
  };

  // TODO: Fix this for android
  const showDateTimePicker = (key: 'startDate') => {
    DateTimePickerAndroid.open({
      value: currentEvent?.[key] || new Date(),
      onChange: (_, date) => setCurrentEvent(p => ({...p, [key]: date})),
      mode: 'date',
      is24Hour: true,
    });
    DateTimePickerAndroid.open({
      value: currentEvent?.[key] || new Date(),
      onChange: (_, date) => setCurrentEvent(p => ({...p, [key]: date})),
      mode: 'time',
      is24Hour: true,
    });
  };

  const showLocationPicker = async () => {
    try {
      const data = await pickPlace({
        enableUserLocation: true,
        enableGeocoding: true,
        color: '#1fcecb',
        initialCoordinates: {
          latitude: -26.171344,
          longitude: 27.9576235,
        },
        title: "Your event's location",
        //...etc
      });

      if (data.didCancel) {
        return;
      }

      setCurrentEvent(p => ({
        ...p,
        location: {
          address: data.address,
          lat: data.coordinate.latitude,
          lng: data.coordinate.longitude,
        },
      }));
    } catch (err) {}
  };

  console.log('Rerender');

  if (loading) {
    return (
      <View
        style={tw`h-screen w-screen justify-center items-center bg-gray-950`}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={tw`flex h-full text-white bg-gray-950`}>
      <TopBar title="Create event" scrollOffsetY={scrollOffsetY} />

      <ScrollView
        style={tw`flex-1 gap-2 border-t-full`}
        onScroll={({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => setScrollOffsetY(y)}>
        <View style={tw`items-center flex flex-row gap-2 px-4`}>
          <View style={tw`relative my-auto items-center flex-1`}>
            <TextInput
              value={currentEvent?.title}
              onChangeText={t => setCurrentEvent(p => ({...p, title: t}))}
              placeholderTextColor={'#949494'}
              style={tw`rounded-lg border border-gray-700/80 bg-gray-950 w-full px-4 text-md h-14 pl-10 text-white`}
              placeholder="Event name"
            />
            <MapSearchIcon
              style={tw`h-6 w-6 absolute text-white top-0 my-auto left-4 top-4`}
            />
          </View>
          <View style={tw`relative my-auto items-center flex-1`}>
            <TextInput
              readOnly
              onTouchStart={() => showLocationPicker()}
              placeholderTextColor={'#949494'}
              style={tw`rounded-lg border border-gray-700/80 bg-gray-950 w-full px-4 text-md h-14 pl-10 text-white`}
              placeholder={
                currentEvent.location
                  ? `${currentEvent.location.address?.name} ${currentEvent.location.address?.streetName} ${currentEvent.location.address?.city}`
                  : 'Location'
              }
            />
            <LocationPinIcon
              style={tw`h-6 w-6 absolute text-white top-0 my-auto left-4 top-4`}
            />
          </View>
        </View>
        <View style={tw`w-full flex z-10 p-4`}>
          <View style={tw`items-center`}>
            <TouchableOpacity
              onPress={pickImage}
              style={tw`h-[25vh] w-[80%] items-center my-auto rounded-lg border border-dashed border-gray-200`}>
              {currentEvent?.poster ? (
                <Image
                  source={currentEvent.poster}
                  style={tw`h-full w-full`}
                  resizeMode="contain"
                />
              ) : (
                <View style={tw`flex items-center gap-2 my-auto`}>
                  <UploadIcon style={tw`h-10 w-10 text-primary`} />
                  <Text style={tw`text-white text-center my-auto`}>
                    Upload poster
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={tw`w-full flex gap-4 z-10 p-4`}>
          <View style={tw`flex gap-6`}>
            <View
              style={tw`items-start gap-2 my-auto place-items-center flex-1`}>
              <Text style={tw`flex text-white font-bold`}>Start date</Text>
              <DateTimePicker
                value={currentEvent?.startDate || new Date()}
                mode="datetime"
                minimumDate={new Date()}
                onChange={(_, date) =>
                  setCurrentEvent(p => ({...p, startDate: date}))
                }
              />
            </View>
            <EntranceFeeDialog
              currentEvent={currentEvent}
              setCurrentEvent={setCurrentEvent}
            />

            <Input
              title="Description"
              inputStyles="h-26"
              inputProps={{
                multiline: true,
                numberOfLines: 7,
                value: currentEvent.description,
                placeholder: 'Tell us more about this event',
                onChangeText: (value: string) =>
                  setCurrentEvent(p => ({
                    ...p,
                    description: value,
                  })),
              }}
            />
          </View>
        </View>
      </ScrollView>
      {error && (
        <Text style={tw`text-red-600 font-semibold text-sm text-center p-2`}>
          {error}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => handleCreateEvent(currentEvent)}
        style={tw`px-2 py-4 bg-primary shadow-lg`}>
        <Text style={tw`text-center text-white font-bold`}>Create event</Text>
      </TouchableOpacity>
    </View>
  );
}

function EntranceFeeDialog({
  currentEvent,
  setCurrentEvent,
}: {
  currentEvent: EventInput;
  setCurrentEvent: React.Dispatch<React.SetStateAction<EventInput>>;
}) {
  const [show, setShow] = useState(false);
  const [fees, setFees] = useState<{label: string; amount: number}[]>(
    currentEvent?.entranceFees || [],
  );

  useEffect(() => {
    if (currentEvent?.entranceFees?.length) {
      setFees([...currentEvent.entranceFees]);
    }
  }, [currentEvent]);

  const onDone = () => {
    setCurrentEvent(p => ({...p, entranceFees: fees}));
    setFees([]);
    setShow(false);
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        collapsable={true}
        onRequestClose={() => {
          setShow(!show);
        }}>
        <View
          style={tw`h-screen w-screen justify-center items-center bg-gray-950 bg-opacity-70`}>
          <View style={tw`flex shadow-lg bg-gray-900 w-[90%] h-1/2 gap-2`}>
            <TouchableOpacity
              style={tw`rounded-full h-6 w-6 self-end mx-6 mt-6`}
              onPress={() => setShow(false)}>
              <CloseIcon style={tw`text-red-400 h-full w-full`} />
            </TouchableOpacity>
            <View style={tw`flex flex-row items-center gap-4`}>
              <Text style={tw`font-bold text-lg p-4 text-white`}>
                Entrance fees
              </Text>
              <TouchableOpacity
                style={tw`rounded-full h-8 w-8 border border-white items-center`}
                onPress={() => setFees(p => [...p, {label: '', amount: 0}])}>
                <Text style={tw`text-white my-auto items-center text-center`}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
            <View style={tw`flex gap-2`}>
              {fees.map((fee, i) => (
                <View style={tw`flex flex-row gap-4 py-2 px-4`}>
                  <View style={tw`relative my-auto items-center flex-1`}>
                    <TextInput
                      placeholderTextColor={'#949494'}
                      style={tw`rounded-lg border border-gray-700/80 bg-gray-950 px-4 text-md w-full h-10 text-white`}
                      placeholder="Category"
                      value={fee.label}
                      onChangeText={newValue =>
                        setFees(p => {
                          p[i].label = newValue;

                          return [...p];
                        })
                      }
                    />
                  </View>
                  <View
                    style={tw`flex-row relative gap-2 my-auto items-center flex-1`}>
                    <View style={tw`relative my-auto items-center flex-1`}>
                      <TextInput
                        keyboardType="number-pad"
                        placeholderTextColor={'#949494'}
                        style={tw`rounded-lg border border-gray-700/80 bg-gray-950 px-4 text-md w-full h-10 pl-8 text-white`}
                        placeholder=""
                        value={fee.amount.toString()}
                        onChangeText={newValue =>
                          setFees(p => {
                            if (isNaN(+newValue)) return p;

                            p[i].amount = +newValue;

                            return [...p];
                          })
                        }
                      />
                      <Text
                        style={tw`h-6 w-6 absolute text-white top-0 my-auto items-center left-3 top-3`}>
                        R
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={tw`rounded-full h-6 w-6 items-center`}
                      onPress={() =>
                        setFees(p => {
                          p.splice(i, 1);

                          return [...p];
                        })
                      }>
                      <CloseIcon style={tw`text-red-400 h-full w-full`} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={tw` py-2 rounded-full mx-2 ${
                fees.filter(fee => fee.label && fee.amount).length !==
                fees.length
                  ? 'bg-gray-700 opacity-30'
                  : 'bg-primary'
              }`}
              onPress={() => onDone()}
              disabled={
                fees.filter(fee => fee.label && fee.amount).length !==
                fees.length
              }>
              <Text style={tw`text-white text-center font-bold`}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={tw`flex gap-2`}>
        <View style={tw`flex flex-row gap-4 items-center`}>
          <Text style={tw`flex text-white font-bold`}>Entrance fee</Text>
          <View style={tw`flex flex-row gap-2 px-4`}>
            <TouchableOpacity
              style={tw`rounded-full border px-4 py-1 gap-2 items-center border-primary flex-row justify-between items-center`}
              onPress={() => setShow(true)}>
              <Text style={tw`text-primary font-semibold items-center`}>
                Edit
              </Text>
              <PencilIcon style={tw`text-primary h-4 w-4 my-auto`} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={tw`flex gap-2`}>
          {currentEvent?.entranceFees?.map((fee, i) => (
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
    </View>
  );
}
