import {useState} from 'react';
import {Asset} from 'react-native-image-picker';
import {Type as EventType, schema} from '../schema';
import {
  Collections,
  useCreateOrUpdateDocument,
  useDocument,
} from 'velo-x/firebase';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';

export function useEvent({navigation}: any) {
  const {
    error: docError,
    loading: docLoading,
    addDocument,
  } = useCreateOrUpdateDocument(schema, Collections.EVENTS);
  const {navigate} = useNavigation();

  const [error, setError] = useState(docError);
  const [loading, setLoading] = useState(docLoading);

  const handleCreateEvent = async (newEvent: EventInput) => {
    setLoading(true);
    setError('');

    const {poster, ...input} = newEvent;
    try {
      if (!poster || !poster.uri) {
        throw new Error('Please add a poster');
      }

      const reference = storage().ref(`posters/${poster.fileName}`);

      console.log({reference});
      await reference.putFile(poster.uri);

      const url = await reference.getDownloadURL();

      const newId = await addDocument({
        ...(input as any),
        poster: url,
      });

      navigation.replace({
        name: 'Event',
        params: {id: newId},
      });
      // navigate({
      //   name: 'Event',
      //   params: {id: newId},
      // } as never);
    } catch (err) {
      console.error(err);
      setError((err as any).message);
    } finally {
      setLoading(false);
    }
  };

  return {error, loading, handleCreateEvent};
}

export type EventInput = {
  poster?: Asset;
} & Partial<
  Pick<EventType, 'startDate' | 'title' | 'location' | 'entranceFees'>
>;
