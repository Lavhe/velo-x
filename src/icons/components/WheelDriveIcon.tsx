import Svg, {Path} from 'react-native-svg';
import {type IconProps} from '../types';
import {Type as ProfileType} from 'velo-x/profile';

export function WheelDriveIcon({
  style,
  wheelDrive,
}: IconProps & {
  wheelDrive: ProfileType['wheelDrive'] | 'Any';
}) {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <Path
        fill={
          ['frontWheel', 'allWheel'].includes(wheelDrive)
            ? 'currentColor'
            : 'white'
        }
        d="M2 1.75H4V0.25H2V1.75ZM4.25 2V7H5.75V2H4.25ZM4 7.25H2V8.75H4V7.25ZM1.75 7V2H0.25V7H1.75ZM2 7.25C1.86193 7.25 1.75 7.13807 1.75 7H0.25C0.25 7.9665 1.0335 8.75 2 8.75V7.25ZM4.25 7C4.25 7.13807 4.13807 7.25 4 7.25V8.75C4.9665 8.75 5.75 7.9665 5.75 7H4.25ZM4 1.75C4.13807 1.75 4.25 1.86193 4.25 2H5.75C5.75 1.0335 4.9665 0.25 4 0.25V1.75ZM2 0.25C1.0335 0.25 0.25 1.0335 0.25 2H1.75C1.75 1.86193 1.86193 1.75 2 1.75V0.25Z"
      />
      <Path
        fill={
          ['rearWheel', 'allWheel'].includes(wheelDrive)
            ? 'currentColor'
            : 'white'
        }
        d="M2 16.75H4V15.25H2V16.75ZM4.25 17V22H5.75V17H4.25ZM4 22.25H2V23.75H4V22.25ZM1.75 22V17H0.25V22H1.75ZM2 22.25C1.86193 22.25 1.75 22.1381 1.75 22H0.25C0.25 22.9665 1.0335 23.75 2 23.75V22.25ZM4.25 22C4.25 22.1381 4.13807 22.25 4 22.25V23.75C4.9665 23.75 5.75 22.9665 5.75 22H4.25ZM4 16.75C4.13807 16.75 4.25 16.8619 4.25 17H5.75C5.75 16.0335 4.9665 15.25 4 15.25V16.75ZM2 15.25C1.0335 15.25 0.25 16.0335 0.25 17H1.75C1.75 16.8619 1.86193 16.75 2 16.75V15.25Z"
      />
      <Path
        fill={
          ['frontWheel', 'allWheel'].includes(wheelDrive)
            ? 'currentColor'
            : 'white'
        }
        d="M20 1.75H22V0.25H20V1.75ZM22.25 2V7H23.75V2H22.25ZM22 7.25H20V8.75H22V7.25ZM19.75 7V2H18.25V7H19.75ZM20 7.25C19.8619 7.25 19.75 7.13807 19.75 7H18.25C18.25 7.9665 19.0335 8.75 20 8.75V7.25ZM22.25 7C22.25 7.13807 22.1381 7.25 22 7.25V8.75C22.9665 8.75 23.75 7.9665 23.75 7H22.25ZM22 1.75C22.1381 1.75 22.25 1.86193 22.25 2H23.75C23.75 1.0335 22.9665 0.25 22 0.25V1.75ZM20 0.25C19.0335 0.25 18.25 1.0335 18.25 2H19.75C19.75 1.86193 19.8619 1.75 20 1.75V0.25Z"
      />
      <Path
        fill={
          ['rearWheel', 'allWheel'].includes(wheelDrive)
            ? 'currentColor'
            : 'white'
        }
        d="M20 16.75H22V15.25H20V16.75ZM22.25 17V22H23.75V17H22.25ZM22 22.25H20V23.75H22V22.25ZM19.75 22V17H18.25V22H19.75ZM20 22.25C19.8619 22.25 19.75 22.1381 19.75 22H18.25C18.25 22.9665 19.0335 23.75 20 23.75V22.25ZM22.25 22C22.25 22.1381 22.1381 22.25 22 22.25V23.75C22.9665 23.75 23.75 22.9665 23.75 22H22.25ZM22 16.75C22.1381 16.75 22.25 16.8619 22.25 17H23.75C23.75 16.0335 22.9665 15.25 22 15.25V16.75ZM20 15.25C19.0335 15.25 18.25 16.0335 18.25 17H19.75C19.75 16.8619 19.8619 16.75 20 16.75V15.25Z"
      />
      <Path
        fill={
          ['rearWheel', 'allWheel'].includes(wheelDrive)
            ? 'currentColor'
            : 'white'
        }
        d="M19 20.25C19.4142 20.25 19.75 19.9142 19.75 19.5C19.75 19.0858 19.4142 18.75 19 18.75V20.25ZM5 18.75C4.58579 18.75 4.25 19.0858 4.25 19.5C4.25 19.9142 4.58579 20.25 5 20.25V18.75ZM5 20.25H19V18.75H5V20.25Z"
      />
      <Path
        fill={
          ['frontWheel', 'allWheel'].includes(wheelDrive)
            ? 'currentColor'
            : 'white'
        }
        d="M10 1.25C9.58579 1.25 9.25 1.58579 9.25 2C9.25 2.41421 9.58579 2.75 10 2.75L10 1.25ZM14 2.75C14.4142 2.75 14.75 2.41421 14.75 2C14.75 1.58579 14.4142 1.25 14 1.25V2.75ZM10 2.75L14 2.75V1.25L10 1.25L10 2.75Z"
      />
      <Path
        fill={['allWheel'].includes(wheelDrive) ? 'currentColor' : 'white'}
        d="M12.75 4.5C12.75 4.08579 12.4142 3.75 12 3.75C11.5858 3.75 11.25 4.08579 11.25 4.5H12.75ZM11.25 19.5C11.25 19.9142 11.5858 20.25 12 20.25C12.4142 20.25 12.75 19.9142 12.75 19.5H11.25ZM11.25 4.5V19.5H12.75V4.5H11.25Z"
      />
      <Path
        fill={
          ['frontWheel', 'allWheel'].includes(wheelDrive)
            ? 'currentColor'
            : 'white'
        }
        d="M19 5.25C19.4142 5.25 19.75 4.91421 19.75 4.5C19.75 4.08579 19.4142 3.75 19 3.75V5.25ZM5 3.75C4.58579 3.75 4.25 4.08579 4.25 4.5C4.25 4.91421 4.58579 5.25 5 5.25L5 3.75ZM5 5.25L19 5.25V3.75L5 3.75L5 5.25Z"
      />
    </Svg>
  );
}