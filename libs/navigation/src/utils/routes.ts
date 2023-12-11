import { LoginPage } from 'auth';
import { LeaderboardPage } from 'leaderboard';
import { EventsPage } from 'event';
import { EventsIcon, LeaderboardIcon, RaceIcon } from 'icons';
import { DrivePage, SpeedTest } from 'drive';
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
    component: EventsPage,
    options: { title: 'Events', icon: EventsIcon }
  },
  Drive: {
    component: DrivePage,
    options: { title: 'Drive', icon: RaceIcon }
  },
  Leaderboard: {
    component: LeaderboardPage,
    options: { title: 'Leaderboard', icon: LeaderboardIcon }
  },
  SpeedTest: {
    component: SpeedTest,
    options: { title: 'SpeedTest', icon: () => null }
  },
  Speedometer: {
    component: SpeedTest,
    options: { title: 'Speedometer', icon: () => null }
  },
  Settings: {
    component: SpeedTest,
    options: { title: 'Settings', icon: () => null }
  },
  QuarterMile: {
    component: SpeedTest,
    options: { title: 'Quarter Mile', icon: () => null }
  }
} as const;

export type RoutePath = keyof typeof routes;
