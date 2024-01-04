import {z} from 'zod';
import {Collections, useDocuments, Filter} from 'velo-x/firebase';
import {useMemo, useState} from 'react';
import {schema, resultSchema, DriveOptions} from 'velo-x/drive';
import {Type as ProfileType} from 'velo-x/profile';

export function useLeaderboard() {
  const [filter, setFilter] = useState<{
    driveOption: DriveOptions;
    wheelDrive: ProfileType['wheelDrive'] | 'Any';
  }>({driveOption: DriveOptions['quarter-mile'], wheelDrive: 'Any'});

  const dbFilter =
    filter.wheelDrive !== 'Any'
      ? Filter.or(
          Filter('profile.wheelDrive', '==', filter.wheelDrive),
          Filter(filter.driveOption, '!=', null),
        )
      : Filter(filter.driveOption, '!=', null);

  const {data, error, loading} = useDocuments(
    schema,
    Collections.RUNS,
    dbFilter,
  );

  console.log(error);

  const [first, second, third, ...rest] = useMemo(
    () =>
      data
        .reduce((acc, current) => {
          const currentFilter = current[filter.driveOption];
          if (currentFilter?.time && currentFilter.time === 9.02) {
            console.log(JSON.stringify(current));
          }
          if (currentFilter) {
            acc.push({
              ...currentFilter,
              vehicleName: current.profile.name,
              driverName: `${current.profile.year} ${current.profile.make} ${current.profile.model}`,
              logo: `https://www.carlogos.org/car-logos/${current.profile.make.toLowerCase()}-logo.png`,
            });
          }

          return acc;
        }, [] as Leaderboard[])
        .sort((a, b) => a.time - b.time),
    [data, filter],
  );

  return {
    leaderboard: rest,
    filter,
    setFilter,
    first,
    second,
    third,
    loading,
    error,
  };
}

type Leaderboard = z.infer<typeof resultSchema> & {
  logo: string;
  driverName: string;
  vehicleName: string;
};
