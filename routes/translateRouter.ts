import { Router } from 'express';
import { translateController } from '../controllers/TranslateController';

export const translateRouter = Router();

translateRouter.post('/', translateController.postTranslate);
