/* eslint-disable jsx-a11y/accessible-emoji */
import { tw } from 'theme';
import { LocationPinIcon, MapSearchIcon, RaceIcon, SettingsIcon } from 'icons';
import {
  Image,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { useDriveScreenItems } from '../hooks/useDriveScreenItems';

const ClassNames = {
  Row: tw`bg-gray-950`,
  Section: tw`my-4 mx-2`,
  Title: tw`text-lg`,
  SubTitle: tw`text-3xl pt-2 font-semibold text-black`,
  Card: tw`flex flex-row align-center bg-white dark:bg-slate-900 dark:text-white shadow-xl shadow-radius-1 shadow-color-opacity-100 rounded-xl m-4 p-4`,
  CardRow: tw`ml-4 mr-8 flex gap-2 text-white`,
  CardIcon: tw`my-auto text-white h-10 w-10`,
  CardRowTitle: tw`text-xl font-bold mb-1 dark:text-white`,
  CardRowText: tw`text-sm font-light text-white`,
};

export function DrivePage() {
  const { landingScreenItems, onPress } = useDriveScreenItems();

  return (
    <View style={tw`flex h-full mt-16`}>
      <ScrollView
        style={ClassNames.Row}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text
          style={tw`flex flex-row my-auto gap-4 font-bold text-4xl text-white mx-8 my-10`}
        >
          Drive <RaceIcon style={tw`h-10 w-10`} />
        </Text>
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
