import { z } from 'zod';
import { firebase } from '@react-native-firebase/firestore';

export const schema = z.object({
  id: z.string(),
  created: z
    .instanceof(firebase.firestore.Timestamp)
    .transform((ts) => ts.toDate()),
  gallery: z.array(z.string()),
  profilePicture: z.string(),
  description: z.string(),
  wheelDrive: z.enum(['all wheel', 'front wheel', 'rear wheel']),
  type: z.enum([
    'suv',
    'hatchback',
    'sedan',
    'coupe',
    'convertible',
    'wagon',
    'truck',
    'van',
    'bike'
  ]),
  kw: z.number(),
  torque: z.number(),
  make: z.string(),
  model: z.string(),
  year: z.number()
});

export type Type = z.infer<typeof schema>;
