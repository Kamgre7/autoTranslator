import { validate } from '../middlewares/validate';
import { PostTranslateSchema } from './postTranslateSchema';

export const validatePostReqBody = validate(PostTranslateSchema);
