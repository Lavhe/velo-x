import {z} from 'zod';
import {schema as profileSchema} from 'velo-x/profile';

export enum DriveOptions {
  '0-to-100' = '0-to-100',
  'quarter-mile' = 'quarter-mile',
  // TODO: Enable these when you are ready
  // '0-to-200' = '0-to-200',
  // '30-to-100' = '30-to-100',
  // '100-to-200' = '100-to-200',
  // 'half-quarter-mile' = 'half-quarter-mile',
  // 'half-mile' = 'half-mile',
  // 'mile' = 'mile',
  // 'brake' = 'brake',
}

export const resultSchema = z.object({
  time: z.number(),
  speed: z.number(),
  distance: z.number(),
});

const driveOptions = Object.values(DriveOptions).reduce((acc, c) => {
  return {...acc, [c]: resultSchema.optional()};
}, {}) as Record<DriveOptions, ReturnType<typeof resultSchema.optional>>;

export const schema = z
  .object({
    id: z.string(),
    // TODO: Fix this when you are ready
    // created: z
    //   .instanceof(firebase.firestore.Timestamp)
    //   .transform(ts => ts.toDate()),
    user: z.string(),
    profile: profileSchema,
    locations: z.array(
      z.object({
        date: z.coerce.date(),
        lat: z.number(),
        lng: z.number(),
        speed: z.number(),
      }),
    ),
  })
  .extend(driveOptions);

export type Type = z.infer<typeof schema>;
