import { useCallback, useState } from 'react';

import { BrakeIcon, QuarterMileIcon, RaceIcon, SpeedometerIcon } from 'icons';
import { useNavigation } from '@react-navigation/native';

export function useDriveScreenItems() {
  const { navigate } = useNavigation();
  const [landingScreenItems] = useState<LandingScreenItem[]>([
    // {
    //   title: 'Show speedometer',
    //   description: `Displays the current speedometer of your car`,
    //   routeName: 'Speedometer',
    //   icon: SpeedometerIcon,
    // },
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
    {
      title: 'Brake test',
      description: `Tests the distance it takes to brake your car`,
      icon: BrakeIcon,
      routeName: 'Speedometer',
    },
  ]);

  const onPress = useCallback(
    (landingScreenItem: LandingScreenItem) => {
      return navigate({
        name: landingScreenItem.routeName,
      } as never);
    },
    [navigate]
  );

  return { landingScreenItems, onPress };
}
interface LandingScreenItem {
  title: string;
  description: string;
  routeName: string;
  icon: (props: any) => JSX.Element;
}
