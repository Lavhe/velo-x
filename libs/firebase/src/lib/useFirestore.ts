import {
  FirebaseFirestoreTypes,
  firebase
} from '@react-native-firebase/firestore';
import { Collections } from '../utils/collections';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

const firestore = firebase.firestore();

export function useDocuments<T extends z.AnyZodObject>(
  schema: T,
  collection: Collections,
  filters?: {
    fieldPath: string | number | FirebaseFirestoreTypes.FieldPath;
    opStr: FirebaseFirestoreTypes.WhereFilterOp;
    value: unknown;
  }[]
) {
  const [data, setData] = useState<z.infer<typeof schema>[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ref = useMemo(() => firestore.collection(collection), [collection]);

  useEffect(() => {
    setLoading(true);
    const query = ref;

    (filters || []).forEach((filter) => {
      query.where(filter.fieldPath, filter.opStr, filter.value);
    });

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
  }, [ref, filters, schema]);

  const addDocument = async (data: T) => {
    setLoading(true);
    try {
      await ref.add({
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
  }, [ref, schema]);

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
