/* eslint-disable jsx-a11y/accessible-emoji */
import { tw } from 'theme';
import { RaceIcon, SettingsIcon } from 'icons';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useDriveScreenItems } from '../hooks/useDriveScreenItems';
import { useState } from 'react';

const ClassNames = {
  Section: tw`py-4 px-4 bg-gray-950 h-screen`,
  Title: tw`text-lg`,
  SubTitle: tw`text-3xl pt-2 font-semibold text-black`,
  Card: tw`flex flex-row align-center bg-slate-900 dark:text-white shadow-xl shadow-radius-1 shadow-color-opacity-100 rounded-xl m-4 p-4`,
  CardRow: tw`ml-4 mr-8 flex gap-2 text-white`,
  CardIcon: tw`my-auto text-white h-10 w-10`,
  CardRowTitle: tw`text-xl font-bold mb-1 dark:text-white`,
  CardRowText: tw`text-sm font-light text-white`,
};

export function DrivePage() {
  const { landingScreenItems, onPress } = useDriveScreenItems();
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
            Drive <RaceIcon style={tw`h-10 w-10`} />
          </Text>
          <View style={tw`flex flex-row gap-6`}>
            <View
              style={tw`relative my-auto place-items-center my-auto w-[80%]`}
            >
              <Text
                style={tw`rounded-lg w-full text-lg font-black py-2 text-white`}
              >
                Golf GTI TCR
              </Text>
            </View>
            <TouchableOpacity style={tw`rounded-lg bg-gray-950 p-3 h-full`}>
              <SettingsIcon style={tw`h-7 w-7 text-white`} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView
        style={tw`flex-1 gap-4 pt-44 z-5`}
        onScroll={({
          nativeEvent: {
            contentOffset: { y },
          },
        }) => setScrollOffsetY(y)}
      >
        <View style={ClassNames.Section}>
          {landingScreenItems.map((landingScreenItem, i) => (
            <View>
              <TouchableOpacity
                style={ClassNames.Card}
                onPress={() => onPress(landingScreenItem)}
                key={i}
              >
                <View style={tw`flex flex-row w-full h-auto`}>
                  <landingScreenItem.icon
                    style={ClassNames.CardIcon}
                    color={tw.color(
                      tw.prefixMatch('dark') ? 'gray-400' : 'primary'
                    )}
                  />
                  <View style={ClassNames.CardRow}>
                    <Text style={ClassNames.CardRowTitle}>
                      {landingScreenItem.title}
                    </Text>
                    <Text style={ClassNames.CardRowText}>
                      {landingScreenItem.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
