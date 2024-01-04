import React, {useState} from 'react';
import {StatusBar, View, SafeAreaView} from 'react-native';

import {UserProvider} from 'velo-x/auth';
import {Loader} from 'velo-x/ui';
import {Navigation} from 'velo-x/navigation';
import {tw, useTailwind} from 'velo-x/theme';

export default function App() {
  const {loaded} = useTailwind();
  const [isLoading, setIsLoading] = useState(true);

  if (!loaded) {
    return <Loader />;
  }

  return (
    <SafeAreaView>
      <UserProvider loaded={() => setIsLoading(false)}>
        <View style={tw`dark h-full w-full dark:bg-red-600 text-white`}>
          <StatusBar barStyle="dark-content" />
          {isLoading ? <Loader /> : <Navigation />}
        </View>
      </UserProvider>
    </SafeAreaView>
  );
}
