import {View, TextInput, TextInputProps, Text} from 'react-native';
import {IconProps} from 'velo-x/icons';
import {tw} from 'velo-x/theme';

export function Input({Icon, inputProps, title, inputStyles}: Props) {
  const className = Icon ? ' pl-10' : '';

  return (
    <View style={tw`my-auto flex-1 flex gap-2`}>
      {title && <Text style={tw`text-white font-bold`}>{title}</Text>}
      <View style={tw`relative`}>
        <TextInput
          placeholderTextColor={'#949494'}
          style={tw`rounded-lg border border-gray-700/80 bg-gray-950 w-full px-4 text-md text-white h-12 ${className} ${
            inputStyles ?? ''
          }`}
          {...inputProps}
        />
        {Icon && (
          <Icon
            style={tw`h-6 w-6 absolute text-white top-0 my-auto left-4 top-4`}
          />
        )}
      </View>
    </View>
  );
}

interface Props {
  title?: string;
  Icon?: ({style, color}: IconProps) => React.JSX.Element;
  inputProps?: TextInputProps;
  inputStyles?: string;
}
