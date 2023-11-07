import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface CurrentUser {
  id: string;
  phoneNumber?: string;
  lastSeen: FirebaseFirestoreTypes.FieldValue;
  updated: FirebaseFirestoreTypes.FieldValue;
  google?: FirebaseAuthTypes.UserCredential.user;
  anonymous?: FirebaseAuthTypes.UserCredential.user;
  profiles: UserProfile[];
}

export interface UserProfile {
  isDefault: boolean;
  vehicleName: string;
  vehiclePicture: string;
  maxSpeed: number;
  unitOfSpeed: 'km/h' | 'mph';
  theme: 'light' | 'dark';
}
