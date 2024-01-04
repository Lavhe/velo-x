import React from 'react';
import {tw} from 'velo-x/theme';
import {Text, TouchableOpacity, ScrollView} from 'react-native';
import {Type as ProfileType} from '../schema';

const ClassNames = {
  Card: tw`flex align-center text-center my-auto bg-gray-600 shadow-radius-1 shadow-color-opacity-100 opacity-80 rounded-xl m-2 px-4 py-2`,
  SelectedCard: tw`flex align-center text-center bg-white bg-gray-800 shadow-lg shadow-radius-1 shadow-color-opacity-100 rounded-xl m-2 px-4 py-2`,
  Row: tw`w-full mx-2 mt-2`,
  RestartButton: tw`justify-center shadow-md rounded-2xl m-4 p-4 bg-white`,
  RestartText: tw`font-medium text-center text-md`,
  Title: tw`text-center text-lg my-auto text-white`,
  SelectedTitle: tw`text-center text-lg font-bold my-auto text-primary`,
  PlusIcon: tw`text-center my-auto text-4xl text-primary`,
};

export function ProfileSelection(props: ProfileSelectionProps) {
  const {profiles, selectedProfileId, selectProfile} = props;

  return (
    <ScrollView style={ClassNames.Row} horizontal={true}>
      <TouchableOpacity
        onPress={() => selectProfile()}
        style={ClassNames.SelectedCard}>
        <Text style={ClassNames.PlusIcon}>+</Text>
      </TouchableOpacity>
      {profiles
        .sort((a, b) => (a.id === selectedProfileId ? -1 : 0))
        .map((profile, i) => (
          <TouchableOpacity
            key={i}
            style={
              selectedProfileId === profile.id
                ? ClassNames.SelectedCard
                : ClassNames.Card
            }
            onPress={() => selectProfile(profile.id)}>
            <Text
              style={
                selectedProfileId === profile.id
                  ? ClassNames.SelectedTitle
                  : ClassNames.Title
              }>
              {profile.name}
            </Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}
interface ProfileSelectionProps {
  profiles: ProfileType[];
  selectProfile: (id?: string) => void;
  selectedProfileId: string | null;
}
