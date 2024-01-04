import {LoginPage} from 'velo-x/auth';
import {LeaderboardPage} from 'velo-x/leaderboard';
import {EventPage, EventsPage} from 'velo-x/event';
import {EventsIcon, LeaderboardIcon, RaceIcon} from 'velo-x/icons';
import {DrivePage, QuarterMile, SpeedTest} from 'velo-x/drive';
import {ProfilePage} from 'velo-x/profile';
import {CreateEventPage} from 'velo-x/event/components/feature-create-event';

export const routes = {
  Login: {
    component: LoginPage,
    options: {title: 'Login'},
  },
  Events: {
    component: EventsPage,
    options: {title: 'Events', icon: EventsIcon},
  },
  Drive: {
    component: DrivePage,
    options: {title: 'Drive', icon: RaceIcon},
  },
  Leaderboard: {
    component: LeaderboardPage,
    options: {title: 'Leaderboard', icon: LeaderboardIcon},
  },
  SpeedTest: {
    component: SpeedTest,
    options: {title: 'SpeedTest'},
  },
  Speedometer: {
    component: SpeedTest,
    options: {title: 'Speedometer'},
  },
  Settings: {
    component: SpeedTest,
    options: {title: 'Settings'},
  },
  QuarterMile: {
    component: QuarterMile,
    options: {title: 'Quarter Mile'},
  },
  CreateEvent: {
    component: CreateEventPage,
    options: {title: 'Create Event'},
  },
  Event: {
    component: EventPage,
    options: {title: 'Event'},
  },
  Profile: {
    component: ProfilePage,
    options: {title: 'Profile'},
  },
} as const;

export type RoutePath = keyof typeof routes;
