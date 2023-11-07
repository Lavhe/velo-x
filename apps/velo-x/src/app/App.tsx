import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';

import { UserProvider } from 'auth';
import { Loader } from 'ui';
import { Navigation } from 'navigation';
import { tw, useTailwind } from 'theme';

export function App() {
  const { loaded } = useTailwind();
  const [isLoading, setIsLoading] = useState(true);

  if (!loaded) {
    return <Loader />;
  }

  return (
    <UserProvider loaded={() => setIsLoading(false)}>
      <View style={tw`dark h-full w-full dark:bg-red-600 text-white`}>
        <StatusBar barStyle="dark-content" />
        {isLoading ? <Loader /> : <Navigation />}
      </View>
    </UserProvider>
  );
}
