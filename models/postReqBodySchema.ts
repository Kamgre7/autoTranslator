import { z } from 'zod';

export const PostReqBodySchema = z
  .object({
    textObj: z.record(z.string(), z.string()),
    targetLanguage: z.string(),
    fromLanguage: z.string().optional(),
  })
  .strict();

export type PostReqBody = z.infer<typeof PostReqBodySchema>;
