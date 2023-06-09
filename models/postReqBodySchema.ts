import { z } from 'zod';

export const postReqBodySchema = z
  .object({
    textObj: z.record(z.string(), z.string()),
    targetLanguage: z.string(),
    fromLanguage: z.string(),
  })
  .strict();

export const reqBodyOptionalFromLanguage = postReqBodySchema.partial({
  fromLanguage: true,
});

export type PostReqBody = z.infer<typeof reqBodyOptionalFromLanguage>;
