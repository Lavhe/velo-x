import React from 'react';
import {tw} from 'velo-x/theme';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useSettings} from '../hooks/useSettings';
import {ProfileSelection} from './feature-profile-selection';
import {VehicleDetails} from '../components/VehicleDetails';
import {VehicleRuns} from '../components';
import {convertToSentenceCase} from 'velo-x/utils';

/* eslint-disable-next-line */
export interface SettingsProps {}

const tabOptions = ['vehicle-runs', 'vehicle-details'] as const;

export function ProfilePage(props: SettingsProps) {
  const settings = useSettings();
  const [currentTab, setCurrentTab] = React.useState(
    'vehicle-runs' as 'vehicle-runs' | 'vehicle-details',
  );

  return (
    <ScrollView style={tw`gap-4`}>
      <View style={tw`bg-gray-900`}>
        <View style={tw`flex gap-6 px-2`}>
          <ProfileSelection
            profiles={settings.profiles || []}
            selectProfile={settings.selectProfile}
            selectedProfileId={settings.selectedProfileId}
          />
          <View style={tw`flex flex-row w-full gap-4`}>
            {tabOptions.map((tab, i) => (
              <TouchableOpacity
                style={tw`px-4 py-2 rounded-lg border-b w-1/2  ${
                  currentTab === tab
                    ? 'text-primary bg-primary/10'
                    : 'text-white border-b-none'
                }`}
                key={i}
                onPress={() => setCurrentTab(tab)}>
                <Text
                  key={i}
                  style={tw`font-bold text-lg  text-center  ${
                    currentTab === tab ? 'text-primary' : 'text-white'
                  }`}>
                  {convertToSentenceCase(tab)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {currentTab === 'vehicle-details' && <VehicleDetails {...settings} />}
          {currentTab === 'vehicle-runs' && (
            <VehicleRuns profile={settings.profile} />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
