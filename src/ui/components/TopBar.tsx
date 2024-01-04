import {useNavigation} from '@react-navigation/native';
import {PropsWithChildren, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {useUserContext} from 'velo-x/auth';
import {MapSearchIcon, LocationPinIcon, AccountIcon} from 'velo-x/icons';
import {tw} from 'velo-x/theme';

export function TopBar({title, scrollOffsetY, children}: TopBarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  console.log('TOP bar');
  return (
    <View
      style={tw`flex-row z-10 top-0 px-4 my-auto pb-6 place-items-center justify-around bg-gray-950 border-b-full`}>
      <View style={tw`flex flex-col px-2 h-auto w-full`}>
        <View
          style={tw`relative flex flex-row items-center w-full transform duration-300 ease-in-out`}>
          <Text
            style={tw`flex-1 font-bold text-white ${
              scrollOffsetY === 0 ? 'text-4xl' : 'text-lg'
            }`}>
            {title}
          </Text>
          <View>
            <ProfileMenu
              setShowDropdown={setShowDropdown}
              showDropdown={showDropdown}
            />
          </View>
        </View>
        {!showDropdown && scrollOffsetY === 0 && children && (
          <View style={tw`flex flex-row gap-6 z-0 pt-6`}>{children}</View>
        )}
      </View>
    </View>
  );
}

function ProfileMenu({
  showDropdown,
  setShowDropdown,
}: {
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {currentUser, currentProfile, logout} = useUserContext();
  const {navigate} = useNavigation();
  const ProfileSelector = (
    <TouchableOpacity
      onPress={() =>
        navigate({
          name: 'Profile',
        } as never)
      }
      style={tw`rounded-full px-4 py-2`}>
      <Text style={tw`text-white font-semibold text-md`}>
        {currentProfile?.name ?? 'Select vehicle'}
      </Text>
    </TouchableOpacity>
  );

  if (currentUser?.anonymous) {
    return (
      <View style={tw`z-10 flex flex-row gap-2 items-center`}>
        {ProfileSelector}
        <TouchableOpacity onPress={() => logout()} style={tw``}>
          <Text style={tw`text-white`}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const name = currentUser?.google.name;

  return (
    <View style={tw`z-10 flex flex-row gap-2 items-center`}>
      {ProfileSelector}
      <TouchableOpacity
        onPress={() => setShowDropdown(p => !p)}
        style={tw`rounded-full`}>
        <AccountIcon style={tw`h-8 w-8 rounded-full text-white`} />
      </TouchableOpacity>
      {showDropdown && (
        <View
          style={tw`absolute py-4 gap-6 bg-gray-900 z-20 right-0 top-10 bg-gray-950 w-32 rounded-lg shadow-lg`}>
          <TouchableOpacity
            onPress={() =>
              navigate({
                name: 'profile',
              } as never)
            }
            style={tw`px-4`}>
            <Text style={tw`text-white`}>{name}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logout()} style={tw`px-4`}>
            <Text style={tw`text-white`}>Log out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
interface TopBarProps extends PropsWithChildren {
  scrollOffsetY: number;
  title: string;
}
