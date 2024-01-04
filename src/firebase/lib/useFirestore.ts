import {
  firebase,
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {Collections} from '../utils/collections';
import {useEffect, useMemo, useState} from 'react';
import {z} from 'zod';
import {useUserContext} from 'velo-x/auth';
import {Filter} from '..';

const firestore = firebase.firestore();

export function useDocuments<T extends z.AnyZodObject>(
  schema: T,
  collection: Collections,
  filter?:
    | FirebaseFirestoreTypes.QueryFilterConstraint
    | FirebaseFirestoreTypes.QueryCompositeFilterConstraint,
) {
  const {currentUser} = useUserContext();
  const [data, setData] = useState<z.infer<typeof schema>[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');

    const whereFilter = filter ?? Filter('created', '!=', null);
    const query = firestore.collection(collection).where(whereFilter);

    const subscriber = query.onSnapshot(
      documentSnapshot => {
        setLoading(false);
        setData([
          ...documentSnapshot.docs.map(doc => {
            return schema.parse({
              ...doc.data(),
              id: doc.id,
            });
          }),
        ]);
      },
      error => {
        setLoading(false);
        setError(error.message);
      },
    );

    return () => subscriber();
  }, [JSON.stringify(filter)]);

  return {
    data,
    error,
    loading,
  };
}

export function useCreateOrUpdateDocument<T extends z.AnyZodObject>(
  schema: T,
  collection: Collections,
  filter?: FirebaseFirestoreTypes.QueryFilterConstraint,
) {
  const {currentUser} = useUserContext();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addDocument = async (
    data: Omit<z.infer<T>, 'id' | 'created' | 'user'> & {
      id?: string;
      created?: string;
      user?: string;
    },
  ) => {
    setLoading(true);
    setError('');

    let newId = '';
    try {
      const newRef = await firestore.collection(collection).add({
        ...JSON.parse(JSON.stringify(data)),
        user: currentUser?.id,
        updated: firebase.firestore.FieldValue.serverTimestamp(),
        created: firebase.firestore.FieldValue.serverTimestamp(),
      });

      newId = newRef.id;
    } catch (error) {
      console.log(error);
      setError((error as {message: string}).message);
    } finally {
      setLoading(false);
    }

    return newId;
  };

  const updateDocument = async (
    id: string,
    data: Omit<z.infer<T>, 'id' | 'created' | 'user'> & {
      id?: string;
      created?: string;
      user?: string;
    },
  ) => {
    setLoading(true);
    setError('');

    try {
      await firestore
        .collection(collection)
        .doc(id)
        .update({
          ...JSON.parse(JSON.stringify(data)),
          user: currentUser?.id,
          updated: firebase.firestore.FieldValue.serverTimestamp(),
          created: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.log(error);
      setError((error as {message: string}).message);
    } finally {
      setLoading(false);
    }

    return id;
  };

  const deleteDocument = async (id: string) => {
    setLoading(true);
    setError('');

    try {
      await firestore.collection(collection).doc(id).delete();
    } catch (error) {
      console.log(error);
      setError((error as {message: string}).message);
    } finally {
      setLoading(false);
    }

    return id;
  };

  return {
    error,
    loading,
    addDocument,
    updateDocument,
    deleteDocument,
  };
}

export function useDocument<T extends z.AnyZodObject>(
  schema: T,
  collection: Collections,
  id: string,
) {
  const [data, setData] = useState<z.infer<typeof schema>>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ref = useMemo(
    () => (id ? firestore.doc(`${collection}/${id}`) : null),
    [collection, id],
  );

  useEffect(() => {
    setError('');
    if (!ref) {
      setData(undefined);
      return;
    }

    setLoading(true);

    const subscriber = ref.onSnapshot(
      documentSnapshot => {
        setLoading(false);
        setData(
          schema.parse({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          }),
        );
      },
      error => {
        setLoading(false);
        setError(error.message);
      },
    );

    return () => subscriber();
  }, [ref]);

  const updateDocument = async (data: Partial<T>) => {
    setLoading(true);
    setError('');

    try {
      await ref?.update({
        ...JSON.parse(JSON.stringify(data)),
        updated: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
      setError((error as {message: string}).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    updateDocument,
  };
}
