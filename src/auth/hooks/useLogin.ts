import {useCallback, useState} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Collections} from 'velo-x/firebase';
import {type CurrentUser} from '../types';
import {useUserContext} from '../context/UserContext';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  webClientId:
    '164734131285-fc9gm26q9tkt9i8m41pvam02ic26uki5.apps.googleusercontent.com',
});

enum StorageKey {
  UNIQUE_ID = 'USER:UNIQUE_ID',
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const {setCurrentUser} = useUserContext();
  const collectionRef = firestore().collection(Collections.USERS);

  const syncUserWithDB = useCallback(
    async (user: any) => {
      collectionRef.doc(user.email).set(
        {
          updated: firestore.FieldValue.serverTimestamp(),
          lastSeen: firestore.FieldValue.serverTimestamp(),
          google: user,
        } as Partial<CurrentUser>,
        {
          merge: true,
        },
      );

      const fullUser = await collectionRef.doc(user.email).get();

      setCurrentUser({
        profiles: [],
        ...(fullUser.data() as any),
        id: fullUser.id,
      });
    },
    [collectionRef, setCurrentUser],
  );

  const syncUniqueID = async () => {
    const id = await AsyncStorage.getItem(StorageKey.UNIQUE_ID);
    if (id) {
      return id;
    }

    const newId = `Anonymous-${
      Date.now().toString(36) + Math.random().toString(36).substr(2)
    }`;

    await AsyncStorage.setItem(StorageKey.UNIQUE_ID, newId);

    return newId;
  };

  const handleAnonymousLogin = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const {user: dbUser} = await auth().signInAnonymously();

      const id = await syncUniqueID();
      const user = JSON.parse(JSON.stringify(dbUser));
      collectionRef.doc(id).set(
        {
          updated: firestore.FieldValue.serverTimestamp(),
          lastSeen: firestore.FieldValue.serverTimestamp(),
          anonymous: user,
        } as Partial<CurrentUser>,
        {
          merge: true,
        },
      );

      const fullUser = await collectionRef.doc(id).get();

      setCurrentUser({
        profiles: [],
        ...(fullUser.data() as any),
        id: fullUser.id,
      });
    } catch (err) {
      console.log('error', {err});
      setError((err as any).message);
    }
    setIsLoading(false);
  }, [collectionRef, setCurrentUser]);

  const handleAppleLogin = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
        // See: https://github.com/invertase/react-native-apple-authentication#faqs
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const {identityToken, nonce, ...dbUser} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );
      const user = JSON.parse(JSON.stringify(dbUser));

      // Sign the user in with the credential
      await auth().signInWithCredential(appleCredential);

      await syncUserWithDB(user);
    } catch (err) {
      console.log('error', {err}, err, JSON.stringify(err));
      setError('Failed to log in, try again later');
    }
    setIsLoading(false);
  }, [syncUserWithDB]);

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log('init');
      const {idToken, user: dbUser} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const user = JSON.parse(JSON.stringify(dbUser));
      if (!user.email) {
        throw new Error('Email not provided');
      }
      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);

      await syncUserWithDB(user);
    } catch (err) {
      console.log('error', {err}, err, JSON.stringify(err));
      setError('Failed to log in, try again later');
    }
    setIsLoading(false);
  }, [syncUserWithDB]);

  return {
    handleGoogleLogin,
    handleAppleLogin,
    handleAnonymousLogin,
    isLoading,
    error,
  };
}
