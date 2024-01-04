/* eslint-disable @typescript-eslint/no-empty-function */
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CurrentUser} from '../types';
import auth from '@react-native-firebase/auth';
import {Collections, useDocument} from 'velo-x/firebase';
import {schema as profileSchema} from 'velo-x/profile';
import crashlytics from '@react-native-firebase/crashlytics';

const MyUserContext = createContext({
  currentUser: null as null | CurrentUser,
  currentProfile: undefined as undefined | CurrentUser['profiles'][0],
  setCurrentUser: (() => null) as React.Dispatch<
    React.SetStateAction<CurrentUser | null>
  >,
  logout: () => {},
});

/**
 * Helper hook for the user context
 */
export function useUserContext() {
  return useContext(MyUserContext);
}
enum StorageKey {
  CurrentUser = 'USER:CURRENT_USER',
}

/**
 * Provider for the user context
 *
 * @param props - content inside the provider
 */
export function UserProvider(props: PropsWithChildren<UserProviderProps>) {
  const {children, loaded} = props;
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const {
    data: profile,
    loading,
    error,
  } = useDocument(
    profileSchema,
    Collections.PROFILES,
    currentUser?.selectedProfile ?? '',
  );

  useEffect(() => {
    if (currentUser) {
      Promise.all([
        crashlytics().setUserId(currentUser.id),
        crashlytics().setAttributes(
          Object.keys(currentUser).reduce(
            (acc, key) => ({
              ...acc,
              [key]: JSON.stringify((currentUser as any)[key] || {}),
            }),
            {} as Record<string, string>,
          ),
        ),
      ]);
    }
  }, [currentUser]);

  useEffect(() => {
    AsyncStorage.multiGet([StorageKey.CurrentUser], (err, result) => {
      if (err) {
        return loaded();
      }
      result?.forEach(keyValue => {
        const {0: key, 1: value} = keyValue;

        if (value) {
          switch (key as StorageKey) {
            case StorageKey.CurrentUser:
              setCurrentUser(JSON.parse(value));
              break;
          }
        }
      });
      return loaded();
    });
  }, [loaded]);

  const logout = useCallback(async () => {
    await auth().signOut();
    setCurrentUser(null);
  }, [setCurrentUser]);

  return (
    <MyUserContext.Provider
      value={{
        currentProfile: profile,
        currentUser,
        setCurrentUser,
        logout,
      }}>
      {children}
    </MyUserContext.Provider>
  );
}
interface UserProviderProps {
  loaded: () => void;
}
