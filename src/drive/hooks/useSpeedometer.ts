import {useCallback, useEffect, useMemo, useState} from 'react';
import {PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import {LocationModule, LocationState, Location} from 'velo-x/location';

enum UnitOfSpeed {
  KILOMETERS = 'km/h',
  MILES = 'mi/h',
}

function useRandomSpeeds() {
  const {currentProfile} = {currentProfile: {maxSpeed: 260}};
  const [run, setRun] = useState(true);
  const [location, setLocation] = useState({
    latitude: -26.171344,
    longitude: 27.9576235,
    timestamp: 0,
    speed: 0,
  });
  const [timestamp, setTimestamp] = useState(0);
  const MAX_SPEED = currentProfile?.maxSpeed || 260;

  const getSpeed = useCallback(() => {
    setTimestamp(Date.now());

    setLocation(p => ({
      speed:
        (p.speed != null && (p.speed >= MAX_SPEED ? 0 : p.speed + 15)) || 0,
      latitude: p.latitude + 0.00007,
      longitude: p.longitude + 0.00007,
      timestamp: Date.now(),
    }));

    if (!run) {
      return;
    }

    setTimeout(() => {
      getSpeed();
    }, 400);
  }, [run]);

  useEffect(() => {
    if (location.speed >= MAX_SPEED) {
      setRun(false);
    }
  }, [location]);

  useEffect(() => {
    getSpeed();
  }, [getSpeed]);

  return {...location, timestamp, locationState: LocationState.GOOD};
}

function useLocationModule() {
  const {currentProfile} = {
    currentProfile: {maxSpeed: 260, unitOfSpeed: 'km/h'},
  };

  const [currentLocation, setCurrentLocation] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
    speed: null as number | null,
    timestamp: 0,
  });
  const [locationState, setLocationState] = useState(LocationState.PENDING);

  const requestLocationPermission = useCallback(async () => {
    let permissionGranted = false;
    switch (Platform.OS) {
      case 'ios':
        permissionGranted =
          (await Location.requestAuthorization('whenInUse')) === 'granted';
        break;
      case 'android':
        permissionGranted =
          (await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          )) === 'granted';
        break;
    }

    if (!permissionGranted) {
      throw new Error('Location permission denied!');
    }

    return true;
  }, []);

  const speedMultiplier = useMemo(() => {
    switch (currentProfile?.unitOfSpeed) {
      case UnitOfSpeed.KILOMETERS:
        return 3.6;
      case UnitOfSpeed.MILES:
        return 2.236936;
      default:
        return 1;
    }
  }, [currentProfile?.unitOfSpeed]);

  const getLocation = useCallback(async () => {
    const currentLocation = await LocationModule.getCurrentLocation();
    const {timestamp, speed, latitude, longitude, isNew} = currentLocation;

    const speedKM = Math.round(speed * speedMultiplier);
    if (isNew) {
      setCurrentLocation({
        timestamp,
        speed: speedKM,
        latitude,
        longitude,
      });
    } else {
      console.log('REPEATING....', {isNew, speedKM});
      ToastAndroid.show(
        JSON.stringify({...currentLocation, speedKM}),
        ToastAndroid.SHORT,
      );
    }

    setLocationState(isNew ? LocationState.GOOD : LocationState.BAD);
    await wait(250);
    await getLocation();

    return;
  }, [speedMultiplier]);

  useEffect(() => {
    requestLocationPermission()
      .then(() => getLocation())
      .catch(console.error);

    return () => {
      const highestId = setTimeout(() => {
        console.log({highestId});
        for (let i = +highestId; i >= 0; i--) {
          clearTimeout(i);
        }
      }, 0);
    };
  }, [getLocation, requestLocationPermission]);

  return {...currentLocation, locationState};
}

function useLocationServices() {
  const {currentProfile} = {
    currentProfile: {maxSpeed: 260, unitOfSpeed: 'km/h'},
  };
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
    speed: null as number | null,
    timestamp: 0,
  });
  const [locationState, setLocationState] = useState(LocationState.PENDING);

  const requestLocationPermission = useCallback(async () => {
    let permissionGranted = false;
    switch (Platform.OS) {
      case 'ios':
        permissionGranted =
          (await Location.requestAuthorization('whenInUse')) === 'granted';
        break;
      case 'android':
        permissionGranted =
          (await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          )) === 'granted';
        break;
    }

    if (!permissionGranted) {
      throw new Error('Location permission denied!');
    }

    return true;
  }, []);

  const speedMultiplier = useMemo(() => {
    switch (currentProfile?.unitOfSpeed) {
      case UnitOfSpeed.KILOMETERS:
        return 3.6;
      case UnitOfSpeed.MILES:
        return 2.236936;
      default:
        return 1;
    }
  }, [currentProfile?.unitOfSpeed]);

  const pollGetLocation = () => {
    Location.getCurrentPosition(
      loc => {
        setCurrentLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          speed:
            loc.coords.speed && Math.round(loc.coords.speed * speedMultiplier),
          timestamp: loc.timestamp,
        });

        setTimeout(() => {
          return pollGetLocation();
        }, 150);
      },
      err => {
        console.log('POLL:  LOCATION ERROR', {err});
      },
      {
        enableHighAccuracy: true,
      },
    );
  };

  useEffect(() => {
    let watchLocationId = 0;
    requestLocationPermission()
      .then(() => {
        watchLocationId = Location.watchPosition(
          loc => console.log({loc}),
          err => {
            console.log({err});
          },
          {
            showLocationDialog: true,
            enableHighAccuracy: true,
            interval: 200,
            fastestInterval: 300,
            distanceFilter: 2,
            forceRequestLocation: true,
            forceLocationManager: true,
            showsBackgroundLocationIndicator: true,
          },
        );

        pollGetLocation();
      })
      .catch(console.error);

    return () => {
      Location.clearWatch(watchLocationId);
      Location.stopObserving();

      const highestId = setTimeout(() => {
        for (let i = +highestId; i >= 0; i--) {
          clearTimeout(i);
        }
      }, 0);
    };
  }, []);

  return {...currentLocation, locationState};
}

function useSpeedFromAccelerometer() {
  // speed = sqrt(x^2 + y^2 + z^2)
  /*
npm install react-native-motion-manager@latest

Accelerometer.setAccelerometerUpdateInterval(0.1); // in seconds
DeviceEventEmitter.addListener('AccelerationData', function (data) {

  data.acceleration.x
  data.acceleration.y
  data.acceleration.z

 });
 Accelerometer.startAccelerometerUpdates(); // you'll start getting AccelerationData events above
 Accelerometer.stopAccelerometerUpdates();
  */
}

export function useSpeedometer() {
  /**
   *  Enable this to be able to test random speeds
   *
   return useLocationModule(); // Do no use this, it is only for android
   return useRandomSpeeds();
   *  */

  return useLocationServices();
}

function wait(milliseconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}
