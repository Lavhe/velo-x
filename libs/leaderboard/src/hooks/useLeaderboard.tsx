import { z } from 'zod';
import { Collections, useDocuments, Filter } from 'firebase';
import { useMemo } from 'react';
import { schema, resultSchema, DriveOptions } from '../schema';

export function useLeaderboard({ filter }: { filter: DriveOptions }) {
  console.log({ filter });
  const { data, error, loading } = useDocuments(
    schema,
    Collections.RUNS,
    Filter(filter, '!=', null)
  );

  const [first, second, third, ...rest] = useMemo(
    () =>
      data
        .reduce((acc, current) => {
          const currentFilter = current[filter];
          if (currentFilter) {
            acc.push({
              ...currentFilter,
              vehicleName: current.vehicle.name,
              driverName: current.user.name,
              logo: `https://www.carlogos.org/car-logos/${current.vehicle.make.toLowerCase()}-logo.png`,
            });
          }

          return acc;
        }, [] as Leaderboard[])
        .sort((a, b) => a.time - b.time),
    [data, filter]
  );

  return {
    leaderboard: rest,
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
