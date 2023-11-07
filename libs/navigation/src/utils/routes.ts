import { HomePage } from 'home';
import { LoginPage } from 'auth';
import { LeaderboardPage } from 'leaderboard';
import {
  AccountIcon,
  ChatIcon,
  EventsIcon,
  LeaderboardIcon,
  RaceIcon
} from 'icons';
// import { Speedometer } from '@jmrsquared-nx/velo-x/screens/speedometer';
// import { SpeedTest } from '@jmrsquared-nx/velo-x/screens/speed-test';
// import { Settings } from '@jmrsquared-nx/velo-x/screens/settings';
// import { QuarterMile } from '@jmrsquared-nx/velo-x/screens/quarter-mile';

export const routes = {
  Login: {
    component: LoginPage,
    options: { title: 'Login', icon: () => null }
  },
  Events: {
    component: HomePage,
    options: { title: 'Events', icon: EventsIcon }
  },
  Drive: {
    component: HomePage,
    options: { title: 'Drive', icon: RaceIcon }
  },
  Leaderboard: {
    component: LeaderboardPage,
    options: { title: 'Events', icon: LeaderboardIcon }
  }
  //   Speedometer: {
  //     component: Speedometer,
  //     options: { title: 'Speedometer' },
  //   },
  //   SpeedTest: {
  //     component: SpeedTest,
  //     options: { title: 'SpeedTest' },
  //   },
  //   Settings: {
  //     component: Settings,
  //     options: { title: 'Settings' },
  //   },
  //   QuarterMile: {
  //     component: QuarterMile,
  //     options: { title: 'Quarter Mile' },
  //   },
} as const;

export type RoutePath = keyof typeof routes;
