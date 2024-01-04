import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useUserContext} from 'velo-x/auth';
import {RoutePath, routes} from '../utils/routes';
import {theme, tw} from 'velo-x/theme';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const pages = Object.keys(routes) as RoutePath[];

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        header: () => null,
        tabBarIcon: ({focused, color, size}) => {
          const Icon = routes[route.name as RoutePath]?.options?.icon;

          if (!Icon) {
            return null;
          }

          return (
            <Icon
              style={tw`h-5 w-5 ease-in-out transform duration-200 ${
                focused ? 'text-primary h-7 w-7' : 'text-white'
              }`}
            />
          );
        },
        tabBarStyle: {
          paddingVertical: 10,
          backgroundColor: '#030712',
        },
      })}
      tabBarOptions={{
        activeTintColor: '#1fcecb',
        inactiveTintColor: 'white',
      }}>
      {pages
        .filter(routeName =>
          ['Events', 'Drive', 'Leaderboard'].includes(routeName),
        )
        .map(routeName => (
          <Tab.Screen
            name={routeName}
            key={routeName}
            component={routes[routeName as RoutePath].component}
          />
        ))}
    </Tab.Navigator>
  );
}

export function Navigation() {
  const {currentUser} = useUserContext();
  const Stack = createNativeStackNavigator();

  const screenLookup = {
    NoAuth: [<Stack.Screen name="Login" component={routes.Login.component} />],
    Auth: [
      <Stack.Screen name="TabNavigator" component={TabNavigator} />,
    ].concat(
      pages
        .filter(
          routeName =>
            !['Events', 'Drive', 'Leaderboard', 'Login'].includes(routeName),
        )
        .map(routeName => (
          <Stack.Screen
            name={routeName}
            key={routeName}
            component={routes[routeName as RoutePath].component}
          />
        )),
    ),
  };

  const Pages = screenLookup[currentUser ? 'Auth' : 'NoAuth'];

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={({route}) => ({
          header: () => null,
        })}>
        {Pages}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
