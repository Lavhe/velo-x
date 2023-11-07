import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useUserContext } from 'auth';
import { RoutePath, routes } from '../utils/routes';
import { Header } from './Header';
import { PropsWithChildren, useCallback, useState } from 'react';
import { ThemeProvider, theme, tw, useTailwind } from 'theme';
import { Text } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();

// export function NavigationOld() {
//   const { loaded } = useTailwind();
//   const { currentUser } = useUserContext();
//   const [startRoute, setStartRoute] = useState('Settings');
//   const pages = Object.keys(routes) as RoutePath[];
//   if (currentUser && startRoute !== 'Home') {
//     setStartRoute('Home');
//   }
//   console.log({ currentUser, startRoute });
//   if (!currentUser) {
//     const routeName = 'Login';
//     console.log('Loading login screen');
//     return (
//       <NavigationContainer theme={theme}>
//         <Stack.Navigator
//           screenOptions={{
//             header: () => null,
//           }}
//         >
//           <Stack.Screen
//             key={routeName}
//             name={routeName}
//             component={() => (
//               <Text style={tw`text-3xl`}>
//                 Test this thing Lorem ipsum dolor sit amet consectetur
//                 adipisicing elit. Veniam ex dignissimos distinctio blanditiis
//                 dicta autem quas nam. Natus ducimus veritatis quibusdam
//                 repellendus laborum, ex doloremque blanditiis molestiae, quas
//                 reiciendis nemo.
//               </Text>
//             )}
//             options={routes[routeName].options}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }

//   const currentProfile = currentUser.profiles.find((p) => p.isDefault);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{
//           header: (props) => {
//             return (
//               <Header {...props} vehicleName={currentProfile?.vehicleName} />
//             );
//           },
//         }}
//         initialRouteName={startRoute}
//       >
//         {pages
//           .filter((v) => v !== 'Login')
//           .map((routeName) => (
//             <Stack.Screen
//               key={routeName}
//               name={routeName}
//               component={() => (
//                 <BottomNavigation>
//                   {routes[routeName as RoutePath].component}
//                 </BottomNavigation>
//               )}
//               options={routes[routeName as RoutePath].options}
//             />
//           ))}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

const Tab = createBottomTabNavigator();
const pages = Object.keys(routes) as RoutePath[];

export function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          header: () => null,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }

            const Icon = routes[route.name as RoutePath].options.icon;

            return <Icon style={tw`text-white h-6 w-6`} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#1fcecb',
          inactiveTintColor: 'white',
        }}
      >
        {pages
          .filter((routeName) => routeName !== 'Login')
          .map((routeName) => (
            <Tab.Screen name={routeName} key={routeName}>
              {(props) => (
                <ThemeProvider>
                  {routes[routeName as RoutePath].component()}
                </ThemeProvider>
              )}
            </Tab.Screen>
          ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
