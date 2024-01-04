import {z} from 'zod';

export const schema = z.object({
  id: z.string(),
  // TODO: Fix this when you are ready
  // created: z
  //   .instanceof(firebase.firestore.Timestamp)
  //   .transform(ts => ts.toDate()),
  // updated: FirebaseFirestoreTypes.FieldValue;
  // lastSeen: FirebaseFirestoreTypes.FieldValue;
  phoneNumber: z.number().optional(),
  google: z
    .object({
      name: z.string(),
      profilePic: z.string(),
      email: z.string(),
    })
    .optional(),
  anonymous: z
    .object({
      name: z.string(),
      profilePic: z.string(),
      email: z.string(),
    })
    .optional(),
  selectedProfile: z.string().optional(),
});

export type Type = z.infer<typeof schema>;
