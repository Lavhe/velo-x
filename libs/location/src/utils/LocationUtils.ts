import { NativeModules } from 'react-native';

const { LocationModule: Module } = NativeModules;

export const LocationModule = {
  getCurrentLocation: () => {
    return new Promise<CurrentLocation>((resolve, _reject) => {
      return Module.getCurrentLocation(resolve);
    });
  }
};

export interface CurrentLocation {
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: number;
  speedAccuracy?: number;
  accuracy?: number;
  isNew?: boolean;
}

export enum LocationState {
  PENDING = 'PENDING',
  BAD = 'BAD',
  GOOD = 'GOOD'
}
