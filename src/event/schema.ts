import {z} from 'zod';

export const schema = z.object({
  id: z.string(),
  // TODO: Enable after fixing the bug on creation
  // created: z.object({}),
  startDate: z.coerce.date(),
  location: z.object({
    address: z
      .object({
        city: z.string(),
        country: z.string(),
        name: z.string(),
        state: z.string(),
        streetName: z.string(),
        zipCode: z.string(),
      })
      .optional(),
    lat: z.number(),
    lng: z.number(),
    placeId: z.string().optional(),
  }),
  title: z.string(),
  poster: z.string(),
  featured: z.boolean().optional().default(false),
  entranceFees: z
    .array(
      z.object({
        amount: z.number(),
        label: z.string(),
      }),
    )
    .default([]),
  user: z.string().optional(),
  description: z.string().default(''),
});

export type Type = z.infer<typeof schema>;
