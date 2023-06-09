import { z } from 'zod';

export const PostReqBodySchema = z
  .object({
    textObj: z.record(z.string(), z.string()),
    targetLanguage: z.string(),
    fromLanguage: z.string(),
  })
  .strict();

export const ReqBodyOptionalFromLanguage = PostReqBodySchema.partial({
  fromLanguage: true,
});

export type PostReqBody = z.infer<typeof ReqBodyOptionalFromLanguage>;
