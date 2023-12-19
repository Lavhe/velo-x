import { tw } from 'theme';
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Image,
} from 'react-native';
import { GoogleLogo, AppleLogo, Logo } from 'icons';
import { useLogin } from '../hooks/useLogin';

const ClassNames = {
  Row: tw`flex-1 bg-gray-950 w-screen h-screen my-auto`,
  Content: tw`flex align-center w-full my-auto`,
  MainContent: tw`flex align-center w-full my-auto gap-6`,
  Card: tw`flex-row bg-gray-900 mx-auto h-auto align-center shadow-xl my-auto shadow-radius-1 shadow-color-opacity-100 rounded-xl p-4`,
  Title: tw`text-white px-2 text-sm font-semibold my-auto`,
  Icon: tw`h-6 w-6 my-auto text-white`,
  Loader: tw`h-screen w-screen my-auto mx-auto`,
  Error: tw`text-white text-red-400 text-center font-semibold text-xs py-2`,
  Skip: tw`absolute bottom-6 mx-auto text-center w-full`,
  SkipText: tw`text-primary text-center font-semibold text-xs py-2`,
  OR: tw`text-white text-xs text-center my-auto font-bold`,
} as const;

export function LoginPage() {
  const {
    handleGoogleLogin,
    handleAppleLogin,
    handleAnonymousLogin,
    isLoading,
    error,
  } = useLogin();

  if (isLoading) {
    return (
      <View style={ClassNames.Row}>
        <ActivityIndicator style={ClassNames.Loader} />
      </View>
    );
  }

  return (
    <View style={ClassNames.Row}>
      <Image
        source={Logo}
        style={tw` justify-center h-40 w-full mx-auto rounded-b-lg bg-primary`}
      />
      <View style={ClassNames.MainContent}>
        <GoogleLogin onPress={handleGoogleLogin} />
        <Text style={ClassNames.OR}>OR</Text>
        <AppleLogin onPress={handleAppleLogin} />
        <Text style={ClassNames.Error}>{error}</Text>
      </View>
      <AnonymousLogin onPress={handleAnonymousLogin} />
    </View>
  );
}

function GoogleLogin({ onPress }: Props) {
  return (
    <View style={ClassNames.Content}>
      <TouchableOpacity onPress={onPress} style={ClassNames.Card}>
        <GoogleLogo style={ClassNames.Icon} />
        <Text style={ClassNames.Title}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

function AppleLogin({ onPress }: Props) {
  return (
    <View style={ClassNames.Content}>
      <TouchableOpacity onPress={onPress} style={ClassNames.Card}>
        <AppleLogo style={ClassNames.Icon} />
        <Text style={ClassNames.Title}>Continue with Apple</Text>
      </TouchableOpacity>
    </View>
  );
}

function AnonymousLogin({ onPress }: Props) {
  return (
    <View style={ClassNames.Skip}>
      <TouchableOpacity onPress={onPress}>
        <Text style={ClassNames.SkipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}
interface Props {
  onPress: () => void;
}
