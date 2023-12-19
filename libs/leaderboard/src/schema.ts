import { z } from 'zod';
import { firebase } from '@react-native-firebase/firestore';

export type DriveOptions =
  | 'half-quarter-mile'
  | 'quarter-mile'
  | 'mile'
  | '0-to-100'
  | '0-to-200'
  | '30-to-100'
  | 'brake';

export const resultSchema = z.object({
  time: z.number(),
  speed: z.number(),
  distance: z.number()
});

export const schema = z.object({
  id: z.string(),
  created: z
    .instanceof(firebase.firestore.Timestamp)
    .transform((ts) => ts.toDate()),
  user: z.object({
    name: z.string()
  }),
  vehicle: z.object({
    name: z.string(),
    make: z.string()
  }),
  locations: z.array(
    z.object({
      date: z
        .instanceof(firebase.firestore.Timestamp)
        .transform((ts) => ts.toDate()),
      address: z.string(),
      lat: z.number(),
      lng: z.number(),
      placeId: z.string()
    })
  ),
  'half-quarter-mile': resultSchema.optional(),
  'quarter-mile': resultSchema.optional(),
  mile: resultSchema.optional(),
  '0-to-100': resultSchema.optional(),
  '0-to-200': resultSchema.optional(),
  '30-to-100': resultSchema.optional(),
  brake: resultSchema.optional()
});

export type Type = z.infer<typeof schema>;
