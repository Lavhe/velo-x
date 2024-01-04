import {useState} from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {IconProps} from 'velo-x/icons';
import {tw} from 'velo-x/theme';
import {convertToSentenceCase} from 'velo-x/utils';

export function SingleSelect<T extends {toString: () => string}>({
  Icon,
  inputProps,
  value,
  items,
  onChange,
  title,
}: Props<T>) {
  const className = Icon ? ' pl-10' : '';
  const [expanded, setExpanded] = useState(false);

  const handleSelect = (value: T) => {
    onChange(value);
    setExpanded(false);
  };

  return (
    <View style={tw`my-auto flex-1 flex gap-2`}>
      {title && <Text style={tw`text-white font-bold`}>{title}</Text>}
      <View style={tw`relative`}>
        <TextInput
          readOnly
          value={convertToSentenceCase(value.toString())}
          placeholderTextColor={'#949494'}
          onTouchEnd={() => setExpanded(p => !p)}
          style={tw`rounded-lg border border-gray-700/80 bg-gray-950 w-full px-4 text-md text-white h-12 ${className}`}
          {...inputProps}
        />
        {Icon && (
          <Icon style={tw`h-6 w-6 absolute text-white my-auto left-3 top-3`} />
        )}
      </View>
      <View style={tw`relative `}>
        {expanded && (
          <Modal
            animationType="fade"
            transparent={true}
            presentationStyle="pageSheet"
            visible={expanded}
            onRequestClose={() => {
              setExpanded(false);
            }}>
            <ScrollView style={tw`h-full bg-gray-900 w-full p-4 flex`}>
              <View
                style={tw`h-full bg-gray-900 w-full p-4 flex flex-row flex-wrap p-4`}>
                {items.map((item, i) => (
                  <TouchableOpacity
                    style={tw`px-2 py-4 border w-1/3 items-center ${
                      item.value === value
                        ? 'border-primary rounded-lg bg-primary/10'
                        : 'border-transparent opacity-60'
                    }`}
                    key={i}
                    onPress={() => handleSelect(item.value)}>
                    {item.label}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Modal>
        )}
      </View>
    </View>
  );
}

interface Props<T> {
  title?: string;
  Icon?: ({style, color}: IconProps) => React.JSX.Element;
  inputProps?: TextInputProps;
  value: T;
  onChange: (value: T) => void;
  items: {
    label: JSX.Element;
    value: T;
  }[];
}
