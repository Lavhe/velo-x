// lib/tailwind.js
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { create, useAppColorScheme, useDeviceContext } from 'twrnc';

// create the customized version...
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const tw = create(require(`../tailwind.config.js`));

export const useTailwind = () => {
  useDeviceContext(tw, { withDeviceColorScheme: false });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colorScheme, toggleColorScheme, setColorScheme] =
    useAppColorScheme(tw);

  console.log(Appearance.getColorScheme());

  useEffect(() => {
    Appearance.setColorScheme('dark');
    setColorScheme('dark');
  }, [setColorScheme]);

  return {
    loaded: colorScheme === 'dark'
  };
};

// ... and then this becomes the main function your app uses
export const theme = {
  dark: false,
  colors: {
    primary: 'rgb(10, 132, 255)',
    card: 'rgb(18, 18, 18)',
    background: 'rgb(1, 1, 1)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)'
  }
} as const;

export * from './context/ThemeProvider';
