// import LottieView from 'lottie-react-native';
import { Props } from './types';

import icon from '../assets/lottie/confetti.json';
import { tw } from 'theme';
import { View } from 'react-native';

export function ConfettiLottie(props: Props) {
  return (
    <View style={tw`h-12 w-12 my-auto`}>
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
