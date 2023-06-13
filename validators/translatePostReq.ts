import { validate } from '../middlewares/validate';
import { PostTranslateSchema } from '../schemas/postTranslateSchema';

export const validateTranslatePostReq = validate(PostTranslateSchema);
