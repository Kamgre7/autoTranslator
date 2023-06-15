import { Response } from 'express';
import {
  ITranslateService,
  translateService,
} from '../services/TranslateService';
import { PostTranslateReq } from '../schemas/postTranslateSchema';

export type ObjectToTranslate = Record<string, string>;

export interface ITranslateController {
  postTranslate(req: PostTranslateReq, res: Response): Promise<void>;
}

export class TranslateController implements ITranslateController {
  constructor(private readonly translateService: ITranslateService) {}

  postTranslate = async (
    req: PostTranslateReq,
    res: Response
  ): Promise<void> => {
    const { textObj, targetLanguage, fromLanguage } = req.body;

    const result = await this.translateService.translate(
      textObj,
      targetLanguage,
      fromLanguage
    );

    res.status(200).json(result);
  };
}

export const translateController = new TranslateController(translateService);
