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
  dark: true,
  colors: {
    primary: '#1fcecb',
    card: '#111827',
    background: '#030712',
    text: 'rgb(229, 229, 231)',
    border: '#111827',
    notification: '#111827'
  }
} as const;

export * from './context/ThemeProvider';
