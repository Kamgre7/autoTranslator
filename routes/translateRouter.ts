import { Router } from 'express';
import { translateController } from '../controllers/TranslateController';
import { validateTranslatePostReq } from '../validators/translatePostReq';

export const translateRouter = Router();

translateRouter
  .route('/translate')
  .post(validateTranslatePostReq, translateController.postTranslate);
