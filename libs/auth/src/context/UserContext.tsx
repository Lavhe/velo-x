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
import { CurrentUser, UserProfile } from '../types';
import auth from '@react-native-firebase/auth';

const MyUserContext = createContext({
  currentUser: null as null | CurrentUser,
  currentProfile: undefined as undefined | UserProfile,
  setCurrentUser: (
    _currentUser:
      | CurrentUser
      | null
      | ((c: CurrentUser | null) => CurrentUser | null)
  ) => {},
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
  const { children, loaded } = props;
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const currentProfile = useMemo(() => {
    return currentUser?.profiles.find((p) => p.isDefault);
  }, [currentUser]);

  console.log('Re-render');
  useEffect(() => {
    console.log('in USE EFFECT');
    AsyncStorage.multiGet([StorageKey.CurrentUser], (err, result) => {
      console.log({ err, result });
      if (err) {
        return loaded();
      }
      result?.forEach((keyValue) => {
        const { 0: key, 1: value } = keyValue;

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
        currentProfile,
        currentUser,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </MyUserContext.Provider>
  );
}
interface UserProviderProps {
  loaded: () => void;
}
