import { z, ZodTypeAny } from 'zod';

const boolean = () =>
  z.preprocess((value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  }, z.boolean());

export const s = {
  string: z.string,
  int: () => z.coerce.number().int(),
  object: z.object,
  options: z.enum,
  url: () => z.url(),
  boolean,
};
