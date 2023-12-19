import { z } from 'zod';
import { firebase } from '@react-native-firebase/firestore';

export const schema = z.object({
  id: z.string(),
  created: z
    .instanceof(firebase.firestore.Timestamp)
    .transform((ts) => ts.toDate()),
  startDate: z
    .instanceof(firebase.firestore.Timestamp)
    .transform((ts) => ts.toDate()),
  endDate: z
    .instanceof(firebase.firestore.Timestamp)
    .transform((ts) => ts.toDate()),
  interval: z.enum(['daily', 'weekly', 'monthly']),
  location: z.object({
    address: z.string(),
    lat: z.number(),
    lng: z.number(),
    placeId: z.string()
  }),
  title: z.string(),
  poster: z.string(),
  featured: z.boolean().optional()
});

export type Type = z.infer<typeof schema>;
