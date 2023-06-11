import { z } from 'zod';

export const PostTranslateBody = z.object({
  textObj: z.record(z.string(), z.string()),
  targetLanguage: z.string(),
  fromLanguage: z
    .string()
    .nullish()
    .transform((arg) => (arg ? arg : null)),
});

export const PostTranslateSchema = z.object({
  body: PostTranslateBody,
});

export type PostTranslateReq = z.infer<typeof PostTranslateSchema>;
export type PostTranslateReqBody = z.infer<typeof PostTranslateBody>;
