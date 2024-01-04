import {View, Image, Text, TouchableOpacity} from 'react-native';
import {WheelDriveIcon, VehicleTypeIcon} from 'velo-x/icons';
import {tw} from 'velo-x/theme';
import {Input, SingleSelect, SingleListPicker, Loader} from 'velo-x/ui';
import {convertToSentenceCase} from 'velo-x/utils';
import {
  vehicleMakeSchema,
  wheelDriveSchema,
  typeSchema,
  schema,
  Type as ProfileType,
} from '..';
import {useCallback, useMemo} from 'react';
import {useSettings} from '../hooks/useSettings';

const ClassNames = {
  Card: tw`flex align-center bg-white bg-gray-800 shadow-xl shadow-radius-1 shadow-color-opacity-100 rounded-xl m-4 p-4`,
  Row: tw`flex-1 bg-white bg-gray-900`,
  DoneButton: tw`justify-center shadow-md rounded-2xl m-4 p-4 bg-primary`,
  DoneButtonText: tw`font-medium text-center text-md text-white`,
  TextField: tw`text-white`,
  ValidationRow: tw`bg-red-300 p-1 mt-4 mx-auto text-center rounded-full`,
  ValidationText: tw`text-center text-md p-2 font-medium`,
  UnitOfSpeedTitle: tw`text-md text-white flex-1 font-semibold`,
  UnitOfSpeedRow: tw`flex-row justify-end`,
  UnitOfSpeedButton: tw`p-2 rounded-2xl mx-2 font-black`,
  UnitOfSpeedText: tw`opacity-30 text-lg text-white`,
  UnitOfSpeedSelectedText: tw`font-black opacity-100 text-lg text-white`,
};

export function VehicleDetails({
  profile,
  setProfile,
  error,
  loading,
  saveChanges,
}: ReturnType<typeof useSettings>) {
  const handleTextChange = useCallback(
    (
      key: keyof ProfileType,
      payload: {value: string | number; validate?: string},
    ) => {
      const {value, validate} = payload;
      if (validate) {
        switch (validate) {
          case 'number':
            if (isNaN(+value)) return;
        }
      }

      setProfile(p => ({
        ...p,
        [key]: value,
      }));
    },
    [setProfile],
  );

  const validatationError = useMemo(() => {
    try {
      schema.parse(profile);

      return false;
    } catch (err) {
      return (err as any).message;
    }
  }, [profile]);

  return (
    <>
      <View style={tw`flex flex-row gap-4`}>
        <Input
          title="Name"
          inputProps={{
            value: profile.name,
            placeholder: 'e.g Navy S3',
            onChangeText: (value: string) => handleTextChange('name', {value}),
          }}
        />
        <Input
          title="Max speed"
          inputProps={{
            value: profile.maxSpeed.toString(),
            onChangeText: (value: string) =>
              handleTextChange('maxSpeed', {
                ...{value: !isNaN(+value) ? +value : 0},
                validate: 'number',
              }),
            keyboardType: 'numeric',
          }}
        />
      </View>
      <View style={tw`flex flex-row gap-4`}>
        <SingleSelect
          title="Make"
          value={profile.make}
          onChange={value => handleTextChange('make', {value})}
          items={Object.values(vehicleMakeSchema.Values).map(value => ({
            value,
            label: (
              <View style={tw`items-center flex gap-4`}>
                <View style={tw`h-8 w-8 bg-white rounded-full`}>
                  <Image
                    style={tw`h-full w-full text-primary`}
                    resizeMode="contain"
                    src={`https://www.carlogos.org/car-logos/${value.toLowerCase()}-logo.png`}
                  />
                </View>
                <Text style={tw`text-center text-xs text-white`}>
                  {convertToSentenceCase(value)}
                </Text>
              </View>
            ),
          }))}
        />
        <Input
          title="Model"
          inputProps={{
            value: profile.model,
            onChangeText: (value: string) =>
              handleTextChange('model', {
                value,
              }),
          }}
        />
        <SingleSelect
          title="Year"
          value={profile.year}
          onChange={value => handleTextChange('year', {value: +value})}
          items={new Array(30).fill(1).map((_, i) => {
            const year = new Date().getFullYear() - i;

            return {
              value: year,
              label: (
                <View style={tw`items-center flex gap-4`}>
                  <Text style={tw`text-center text-xs text-white`}>{year}</Text>
                </View>
              ),
            };
          })}
        />
      </View>
      <SingleListPicker
        title="Wheel drive"
        value={profile.wheelDrive}
        onChange={value => handleTextChange('wheelDrive', {value})}
        items={Object.values(wheelDriveSchema.Values).map(value => ({
          value,
          label: (
            <View style={tw`items-center flex gap-4`}>
              <WheelDriveIcon
                style={tw`h-8 w-8 text-primary`}
                wheelDrive={value}
              />
              <Text style={tw`text-center text-xs text-white`}>
                {convertToSentenceCase(value)}
              </Text>
            </View>
          ),
        }))}
      />
      <SingleListPicker
        title="Type"
        value={profile.type}
        onChange={value => handleTextChange('type', {value})}
        items={Object.values(typeSchema.Values).map(value => ({
          value,
          label: (
            <View style={tw`items-center flex gap-4`}>
              <VehicleTypeIcon
                style={tw`h-8 w-8 text-white`}
                vehicleType={value}
              />
              <Text style={tw`text-center text-xs text-white`}>
                {convertToSentenceCase(value)}
              </Text>
            </View>
          ),
        }))}
      />
      <View style={tw`flex flex-row gap-4`}>
        <Input
          title="kilowatts (optional)"
          inputProps={{
            value: profile.kw?.toString() || '',
            placeholder: 'e.g 212',
            onChangeText: (value: string) =>
              handleTextChange('kw', {value: +value, validate: 'number'}),
            keyboardType: 'numeric',
          }}
        />

        <Input
          title="Torque (optional)"
          inputProps={{
            value: profile.torque?.toString() || '',
            placeholder: 'e.g 400',
            onChangeText: (value: string) =>
              handleTextChange('torque', {value: +value, validate: 'number'}),
            keyboardType: 'numeric',
          }}
        />
      </View>
      <Input
        title="Description (optional)"
        inputStyles="h-26"
        inputProps={{
          multiline: true,
          numberOfLines: 7,
          value: profile.description,
          placeholder: 'Tell us more about your vehicle',
          onChangeText: (value: string) =>
            handleTextChange('description', {value}),
        }}
      />

      {/**
       * TODO: Enable this when we want to change the unit of speed
       */}
      {/* <View style={tw`items-center flex flex-row`}>
          <Text style={ClassNames.UnitOfSpeedTitle}>Unit Of Speed</Text>
          <View style={ClassNames.UnitOfSpeedRow}>
            <TouchableOpacity
              style={ClassNames.UnitOfSpeedButton}
              onPress={() =>
                handleTextChange('unitOfSpeed', {
                  value: UnitOfSpeed.KILOMETERS,
                })
              }>
              <Text
                style={
                  profile.unitOfSpeed === UnitOfSpeed.KILOMETERS
                    ? ClassNames.UnitOfSpeedSelectedText
                    : ClassNames.UnitOfSpeedText
                }>
                km/h
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ClassNames.UnitOfSpeedButton}
              onPress={() =>
                handleTextChange('unitOfSpeed', {
                  value: UnitOfSpeed.MILES,
                })
              }>
              <Text
                style={
                  profile.unitOfSpeed === UnitOfSpeed.MILES
                    ? ClassNames.UnitOfSpeedSelectedText
                    : ClassNames.UnitOfSpeedText
                }>
                mph
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
      {validatationError || error ? (
        <View style={ClassNames.ValidationRow}>
          <Text style={ClassNames.ValidationText}>
            {validatationError || error}
          </Text>
        </View>
      ) : loading ? (
        <Loader />
      ) : (
        <TouchableOpacity style={ClassNames.DoneButton} onPress={saveChanges}>
          <Text style={ClassNames.DoneButtonText}>Done</Text>
        </TouchableOpacity>
      )}
    </>
  );
}
