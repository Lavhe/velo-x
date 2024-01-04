import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {Type as ProfileType} from 'velo-x/profile';

export interface CurrentUser {
  id: string;
  phoneNumber?: string;
  lastSeen: FirebaseFirestoreTypes.FieldValue;
  updated: FirebaseFirestoreTypes.FieldValue;
  google?: FirebaseAuthTypes.UserCredential.user;
  anonymous?: FirebaseAuthTypes.UserCredential.user;
  profiles: ProfileType[];
  selectedProfile: string;
}
