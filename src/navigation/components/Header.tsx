import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {Text, TouchableOpacity, View, Platform} from 'react-native';
import {tw} from 'velo-x/theme';
import {PollIcon, SettingsIcon, ArrowLeftIcon} from 'velo-x/icons';

const ClassNames = {
  RowIOS: tw`flex-row align-center my-auto pt-12 px-5 pb-3 bg-primary dark:bg-gray-900 shadow-xl shadow-radius-1 shadow-color-opacity-100`,
  RowAndroid: tw`flex-row align-center my-auto py-5 px-6 bg-primary dark:bg-gray-900 shadow-xl shadow-radius-1 shadow-color-opacity-100`,
  TitleRow: tw`text-lg gap-2 flex-1 font-light my-auto`,
  Title: tw`text-xl font-light text-black dark:text-white`,
  SubTitle: tw`text-md pt-2 font-semibold text-white`,
  Icon: tw`w-5 h-5 my-auto mx-2 justify-center items-center rounded-full`,
  BackIcon: tw`w-8 w-8 justify-center items-center pr-4 rounded-full`,
};
export function Header({navigation, options, route, vehicleName}: HeaderProps) {
  const rowClassName =
    Platform.OS === 'ios' ? ClassNames.RowIOS : ClassNames.RowAndroid;

  return (
    <View style={rowClassName}>
      {navigation.canGoBack() && (
        <TouchableOpacity
          style={ClassNames.BackIcon}
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon style={ClassNames.Icon} color={'white'} />
        </TouchableOpacity>
      )}
      <View style={ClassNames.TitleRow}>
        <Text style={ClassNames.Title}>{options.title}</Text>
        {vehicleName && <Text style={ClassNames.SubTitle}>{vehicleName}</Text>}
      </View>
      <LeaderBoardIconButton navigation={navigation} route={route} />
      <SettingsIconButton navigation={navigation} route={route} />
    </View>
  );
}
function LeaderBoardIconButton({navigation, route}: IconButtonProps) {
  const hasLeaderBoard = ['SpeedTest', 'QuarterMile'].some(
    name => name === route.name,
  );

  if (!hasLeaderBoard) {
    return null;
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate('LeaderBoard')}>
      <PollIcon style={ClassNames.Icon} color={'white'} />
    </TouchableOpacity>
  );
}
function SettingsIconButton({navigation, route}: IconButtonProps) {
  if (route.name === 'Settings') {
    return null;
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
      <SettingsIcon style={ClassNames.Icon} color={'white'} />
    </TouchableOpacity>
  );
}
type IconButtonProps = Pick<NativeStackHeaderProps, 'navigation' | 'route'>;
interface HeaderProps extends NativeStackHeaderProps {
  vehicleName?: string;
}
