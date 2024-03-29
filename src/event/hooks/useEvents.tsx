import {Collections, useDocuments} from 'velo-x/firebase';
import {useMemo} from 'react';
import {schema} from '../schema';

export function useEvents() {
  const {data, error, loading} = useDocuments(schema, Collections.EVENTS);

  const {popularEvents, upcomingEvents} = useMemo(
    () =>
      data.reduce(
        (acc, current) => {
          if (current.startDate >= new Date()) {
            acc.upcomingEvents.push(current);
          }

          if (current.featured) {
            acc.popularEvents.push(current);
          }
          return acc;
        },
        {
          upcomingEvents: [] as typeof data,
          popularEvents: [] as typeof data,
        },
      ),
    [data],
  );

  return {
    popularEvents,
    upcomingEvents,
    loading,
    error,
  };
}
