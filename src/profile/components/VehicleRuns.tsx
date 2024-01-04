import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {tw} from 'velo-x/theme';
import {LineChart, Loader} from 'velo-x/ui';
import {useRuns} from '../hooks/useRuns';
import {useSettings} from '../hooks/useSettings';
import {DriveOptions, resultSchema} from 'velo-x/drive';
import {useMemo, useState} from 'react';
import {z} from 'zod';
import {convertToSentenceCase} from 'velo-x/utils';
import {} from 'react-native-svg';
import {CloseIcon, TrashIcon} from 'velo-x/icons';
import {CurrentLocation} from 'velo-x/location';
import moment from 'moment';

const driveOptions = Object.values(DriveOptions);

export function VehicleRuns({
  profile,
}: Pick<ReturnType<typeof useSettings>, 'profile'>) {
  const [selectedRun, setSelectedRun] = useState<RunType>();
  const {loading, error, runs, deleteRun} = useRuns({
    profileId: profile.id,
  });

  const handleRemoveRun = async () => {
    if (!selectedRun?.id) {
      return;
    }

    await deleteRun(selectedRun.id);
    setSelectedRun(undefined);
  };

  const grouped = useMemo(
    () =>
      runs.reduce((acc, run) => {
        driveOptions.forEach(driveOption => {
          const currentRun = run[driveOption];
          if (currentRun) {
            if (!acc[driveOption]) {
              acc[driveOption] = [];
            }

            const sortedLocations = run.locations.sort((a, b) =>
              moment(a.date).isBefore(b.date) ? -1 : 1,
            );

            const speeds = sortedLocations.map((location, i) => ({
              x:
                i === 0
                  ? '0'
                  : Number(
                      moment(location.date).diff(
                        sortedLocations[0].date,
                        'milliseconds',
                      ) / 1000,
                    ).toFixed(2),
              y: location.speed,
            }));

            acc[driveOption].push({
              id: run.id,
              ...currentRun,
              speeds,
              vehicleName: run.profile.name,
              driverName: `${run.profile.year} ${run.profile.make} ${run.profile.model}`,
              logo: `https://www.carlogos.org/car-logos/${run.profile.make.toLowerCase()}-logo.png`,
            });
          }
        });

        return acc;
      }, {} as Record<DriveOptions, RunType[]>),
    [runs],
  );

  if (loading) {
    return (
      <View
        style={tw`h-screen w-screen justify-center items-center bg-gray-950`}>
        <Loader />
      </View>
    );
  }

  if (!runs.length) {
    return (
      <Text
        style={tw`my-auto h-screen text-red-600 gap-2 text-center items-center self-center font-bold`}>
        No runs for {profile.name}
      </Text>
    );
  }

  return (
    <View style={tw`gap-6`}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={Boolean(selectedRun)}
        collapsable={true}
        onRequestClose={() => {
          setSelectedRun(undefined);
        }}>
        {selectedRun && (
          <View
            style={tw`h-screen w-screen justify-center items-center bg-gray-950 bg-opacity-70`}>
            <View style={tw`flex shadow-lg bg-gray-900 w-[90%] h-2/3 gap-2`}>
              <TouchableOpacity
                style={tw`rounded-full h-6 w-6 self-end mx-6 mt-6`}
                onPress={() => setSelectedRun(undefined)}>
                <CloseIcon style={tw`text-red-400 h-full w-full`} />
              </TouchableOpacity>
              <View style={tw`flex gap-2`}>
                <View
                  style={tw`flex-row relative shadow-sm gap-4 py-4 px-4 items-center w-full`}>
                  <View
                    style={tw`h-12 w-12 rounded-full mx-auto items-center bg-white p-1`}>
                    <Image
                      source={{uri: selectedRun.logo}}
                      resizeMode="contain"
                      style={tw`h-full w-full rounded-full mx-auto`}
                    />
                  </View>
                  <View style={tw`flex-1 font-semibold gap-1`}>
                    <Text style={tw`text-white font-semibold`}>
                      {selectedRun.vehicleName}
                    </Text>
                    <Text style={tw`text-white text-sm font-light`}>
                      {selectedRun.driverName}
                    </Text>
                    <Text
                      style={tw`text-gray-100 text-xs font-bold my-auto rounded-full`}>
                      {selectedRun.time} seconds
                    </Text>
                  </View>
                </View>
                <View style={tw`mx-4 my-4`}>
                  <LineChart height={220} data={selectedRun.speeds} />
                </View>
              </View>
              <TouchableOpacity
                style={tw`mt-auto justify-center flex-row py-4 rounded-full mx-2 gap-2`}
                onPress={() => handleRemoveRun()}>
                <TrashIcon
                  style={tw`text-red-600 h-5 w-5 my-auto items-center`}
                />
                <Text
                  style={tw`text-red-600 gap-2 text-center items-center self-center font-bold`}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
      {error && (
        <Text style={tw`text-red-600 p-4 font-bold text-center`}>{error}</Text>
      )}
      {Object.keys(grouped).map((key, i) => (
        <View style={tw`flex gap-2`}>
          <Text style={tw`text-white font-bold text-lg p-2`}>
            {convertToSentenceCase(key)}
          </Text>
          <View>
            {grouped[key as keyof typeof grouped]
              .sort((a, b) => a.time - b.time)
              .map((value, i) => (
                <TouchableOpacity
                  onPress={() => setSelectedRun(value)}
                  key={i}
                  style={tw`flex-row relative py-0.5 w-full`}>
                  <View
                    style={tw`h-full w-[${
                      100 -
                      (Math.abs(
                        value.time -
                          grouped[key as keyof typeof grouped].sort(
                            (a, b) => a.time - b.time,
                          )[0].time,
                      ) /
                        grouped[key as keyof typeof grouped].sort(
                          (a, b) => a.time - b.time,
                        )[0].time /
                        2) *
                        100
                    }%] bg-primary bg-opacity-10 border-r-4 border-primary absolute rounded-r-xl`}
                  />
                  <View
                    style={tw`flex-row relative shadow-sm gap-4 py-4 px-4 items-center w-full`}
                    key={i}>
                    <Text style={tw`text-white text-sm`}>{i + 4}</Text>

                    <View
                      style={tw`h-12 w-12 rounded-full mx-auto items-center bg-white p-1`}>
                      <Image
                        source={{uri: value.logo}}
                        resizeMode="contain"
                        style={tw`h-full w-full rounded-full mx-auto`}
                      />
                    </View>
                    <View style={tw`flex-1 font-semibold`}>
                      <Text style={tw`text-white font-semibold`}>
                        {value.vehicleName}
                      </Text>
                      <Text style={tw`text-white text-sm font-light`}>
                        {value.driverName}
                      </Text>
                    </View>
                    <Text
                      style={tw`text-gray-100 text-xs font-bold my-auto rounded-full px-2`}>
                      {value.time} seconds
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      ))}
    </View>
  );
}

type RunType = z.infer<typeof resultSchema> & {
  speeds: {
    x: string;
    y: number;
  }[];
  id: string;
  logo: string;
  driverName: string;
  vehicleName: string;
};
