import { Router } from 'express';
import { translateController } from '../controllers/TranslateController';
import { validatePostReqBody } from '../models/validator';

export const translateRouter = Router();

translateRouter
  .route('/')
  .post(validatePostReqBody, translateController.postTranslate);
