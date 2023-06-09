import { validate } from '../middlewares/validate';
import { PostReqBodySchema } from './postReqBodySchema';

export const validatePostReqBody = validate(PostReqBodySchema);
