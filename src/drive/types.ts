import {Type as RunType} from './schema';

export enum UnitOfSpeed {
  KILOMETERS = 'km/h',
  MILES = 'mph',
}

export interface Results {
  time: string;
  speed: number;
}
export interface AllSpeeds {
  [timestamp: string]: RunType['locations'][0];
}
export enum Status {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
export interface Message {
  status: Status;
  message: string;
}
