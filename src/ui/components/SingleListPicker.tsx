import {
  View,
  TextInput,
  TextInputProps,
  Text,
  TouchableOpacity,
} from 'react-native';
import {IconProps} from 'velo-x/icons';
import {tw} from 'velo-x/theme';

export function SingleListPicker<T>({
  Icon,
  value,
  onChange,
  title,
  items,
}: Props<T>) {
  return (
    <View style={tw`my-auto flex-1 flex gap-4`}>
      {title && <Text style={tw`text-white font-bold`}>{title}</Text>}
      <View style={tw`flex flex-row flex-wrap items-center`}>
        {items.map((item, i) => (
          <TouchableOpacity
            style={tw`px-2 py-4 border w-1/4 items-center ${
              item.value === value
                ? 'border-primary rounded-lg bg-primary/10'
                : 'border-transparent opacity-60'
            }`}
            key={i}
            onPress={() => onChange(item.value)}>
            {item.label}
          </TouchableOpacity>
        ))}
      </View>
      {Icon && (
        <Icon
          style={tw`h-6 w-6 absolute text-white top-0 my-auto left-4 top-4`}
        />
      )}
    </View>
  );
}

interface Props<T> {
  title?: string;
  Icon?: ({style, color}: IconProps) => React.JSX.Element;
  value: T;
  onChange: (value: T) => void;
  items: {
    label: JSX.Element;
    value: T;
  }[];
}
