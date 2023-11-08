import { useCallback, useState } from 'react';

import { BrakeIcon, QuarterMileIcon, RaceIcon, SpeedometerIcon } from 'icons';

export function useDriveScreenItems() {
  const [landingScreenItems] = useState<LandingScreenItem[]>([
    {
      title: 'Show speedometer',
      description: `Displays the current speedometer of your car`,
      routeName: 'Speedometer',
      icon: SpeedometerIcon,
    },
    {
      title: 'Brake test',
      description: `Tests the distance it takes to brake your car`,
      icon: BrakeIcon,
      routeName: 'Speedometer',
    },
    {
      title: '0 - 100 Speed test',
      description: `Tests the acceleration speed from 0 to 100`,
      icon: RaceIcon,
      routeName: 'SpeedTest',
    },
    {
      title: 'Quarter mile run',
      description: `See how fast your car travels over a quarter mile`,
      icon: QuarterMileIcon,
      routeName: 'QuarterMile',
    },
  ]);

  const onPress = useCallback((landingScreenItem: LandingScreenItem) => {
    //   return navigate({
    //     name: landingScreenItem.routeName,
    //   } as never);
  }, []);

  return { landingScreenItems, onPress };
}
interface LandingScreenItem {
  title: string;
  description: string;
  routeName: string;
  icon: (props: any) => JSX.Element;
}
