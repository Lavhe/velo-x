/* eslint-disable jsx-a11y/accessible-emoji */
import {tw} from 'velo-x/theme';
import {SettingsIcon} from 'velo-x/icons';
import {Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {useDriveScreenItems} from '../hooks/useDriveScreenItems';
import {useState} from 'react';
import {TopBar} from 'velo-x/ui';
import {useNavigation} from '@react-navigation/native';
import {useUserContext} from 'velo-x/auth';

const ClassNames = {
  Section: tw`py-4 px-4 bg-gray-950 h-full`,
  Title: tw`text-lg`,
  SubTitle: tw`text-3xl pt-2 font-semibold text-black`,
  Card: tw`flex flex-row align-center bg-slate-900 dark:text-white shadow-xl shadow-radius-1 shadow-color-opacity-100 rounded-xl m-4 p-4`,
  CardRow: tw`ml-4 mr-8 flex gap-2 text-white`,
  CardIcon: tw`my-auto text-white h-10 w-10`,
  CardRowTitle: tw`text-xl font-bold mb-1 dark:text-white`,
  CardRowText: tw`text-sm font-light text-white`,
};

export function DrivePage() {
  const {landingScreenItems, onPress} = useDriveScreenItems();
  const [scrollOffsetY, setScrollOffsetY] = useState(0);
  const {currentProfile} = useUserContext();
  const handlePress = (landingScreenItem: (typeof landingScreenItems)[0]) => {
    if (!currentProfile) {
      return Alert.alert(
        'No vehicle selected',
        'Please select a vehicle at the top first',
      );
    }

    onPress(landingScreenItem);
  };

  return (
    <View style={tw`flex h-full text-white bg-gray-950`}>
      <TopBar title="Drive" scrollOffsetY={scrollOffsetY}></TopBar>

      <ScrollView
        style={tw`flex-1 gap-4 z-5`}
        onScroll={({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => setScrollOffsetY(y)}>
        <View style={ClassNames.Section}>
          {landingScreenItems.map((landingScreenItem, i) => (
            <View>
              <TouchableOpacity
                style={ClassNames.Card}
                onPress={() => handlePress(landingScreenItem)}
                key={i}>
                <View style={tw`flex flex-row w-full h-auto`}>
                  <landingScreenItem.icon
                    style={ClassNames.CardIcon}
                    color={tw.color(
                      tw.prefixMatch('dark') ? 'gray-400' : 'primary',
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
