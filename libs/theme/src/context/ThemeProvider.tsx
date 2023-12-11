import { useFocusEffect } from '@react-navigation/native';
import { PropsWithChildren, useCallback, useState } from 'react';
import { View } from 'react-native';
import { tw } from 'theme';

export function ThemeProvider({ children }: PropsWithChildren) {
  const [forceRenderKey, setForceRenderKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setForceRenderKey((v) => v + 1);
    }, [])
  );

  return <View style={tw``}>{children}</View>;
}
