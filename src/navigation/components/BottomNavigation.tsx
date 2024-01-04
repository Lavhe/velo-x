import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {Text, TouchableOpacity, View, Platform} from 'react-native';
import {tw} from 'velo-x/theme';
import {PollIcon} from 'velo-x/icons';
import {PropsWithChildren} from 'react';

const ClassNames = {
  Grid: tw`h-screen w-screen`,
  Row: tw``,
  BottomNav: tw`flex gap-4 place-items-center h-20 absolute bottom-0 bg-gray-800`,
  NavIcon: tw`w-4 h-4 text-center`,
  NavText: tw`text-xs text-center text-center font-semibold`,
} as const;

export function BottomNavigation({children}: PropsWithChildren) {
  return (
    <View style={ClassNames.Grid}>
      <View style={ClassNames.Row}>{children}</View>
      <View style={ClassNames.BottomNav}>
        <TouchableOpacity onPress={() => console.log('LeaderBoard')}>
          <PollIcon style={ClassNames.NavIcon} color={'white'} />
          <Text style={ClassNames.NavText}>Leaderboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
