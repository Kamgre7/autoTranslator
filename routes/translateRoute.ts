import { Router } from 'express';
import { translateController } from '../controllers/TranslateController';

export const translate = Router();

translate.post('/', translateController.postTranslate);
