import { validate } from '../middlewares/validate';
import { reqBodyOptionalFromLanguage } from './postReqBodySchema';

export const validatePostReqBody = validate(reqBodyOptionalFromLanguage);
