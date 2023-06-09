import { validate } from '../middlewares/validate';
import { ReqBodyOptionalFromLanguage } from './postReqBodySchema';

export const validatePostReqBody = validate(ReqBodyOptionalFromLanguage);
