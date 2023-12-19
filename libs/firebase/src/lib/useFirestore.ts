import {
  firebase,
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';
import { Collections } from '../utils/collections';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

const firestore = firebase.firestore();

export function useDocuments<T extends z.AnyZodObject>(
  schema: T,
  collection: Collections,
  filter?: FirebaseFirestoreTypes.QueryFilterConstraint
) {
  const [data, setData] = useState<z.infer<typeof schema>[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const query = firestore.collection(collection);

    if (filter) {
      query.where(filter);
    }

    const subscriber = query.onSnapshot(
      (documentSnapshot) => {
        setLoading(false);
        setData([
          ...documentSnapshot.docs.map((doc) =>
            schema.parse({
              id: doc.id,
              ...doc.data()
            })
          )
        ]);
      },
      (error) => {
        setLoading(false);
        setError(error.message);
      }
    );

    return () => subscriber();
  }, []);

  const addDocument = async (data: z.infer<T>) => {
    setLoading(true);
    try {
      await firestore.collection(collection).add({
        ...JSON.parse(JSON.stringify(data)),
        updated: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.log(error);
      setError((error as { message: string }).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    addDocument
  };
}

export function useDocument<T extends z.AnyZodObject>(
  schema: T,
  collection: Collections,
  id: string
) {
  const [data, setData] = useState<z.infer<typeof schema>>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ref = useMemo(
    () => firestore.doc(`${collection}/${id}`),
    [collection, id]
  );

  useEffect(() => {
    setLoading(true);

    const subscriber = ref.onSnapshot(
      (documentSnapshot) => {
        setLoading(false);
        setData(
          schema.parse({
            id: documentSnapshot.id,
            ...documentSnapshot.data()
          })
        );
      },
      (error) => {
        setLoading(false);
        setError(error.message);
      }
    );

    return () => subscriber();
  }, []);

  const updateDocument = async (data: Partial<T>) => {
    setLoading(true);
    try {
      await ref.update({
        ...JSON.parse(JSON.stringify(data)),
        updated: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.log(error);
      setError((error as { message: string }).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    updateDocument
  };
}
