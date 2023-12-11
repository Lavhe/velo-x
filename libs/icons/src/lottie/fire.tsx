// import LottieView from 'lottie-react-native';
import { Props } from './types';

import icon from '../assets/lottie/fire.json';
import { tw } from 'theme';
import { View } from 'react-native';

export function FireLottie(props: Props) {
  return (
    <View style={tw`h-8 w-8 my-auto`}>
      {/* <LottieView
        autoPlay
        loop
        {...props}
        source={icon}
        style={tw`h-full w-full`}
      /> */}
    </View>
  );
}
