import { Request, Response } from 'express';
import {
  ITranslateService,
  translateService,
} from '../services/TranslateService';
import { PostReqBody } from '../models/postReqBodySchema';

export type ObjectToTranslate = {
  [key: string]: string;
};

export interface ITranslateController {
  postTranslate(req: Request, res: Response): Promise<void>;
}

export class TranslateController implements ITranslateController {
  constructor(private readonly translateService: ITranslateService) {}

  postTranslate = async (req: Request, res: Response): Promise<void> => {
    const { textObj, targetLanguage, fromLanguage }: PostReqBody = req.body;

    const from = fromLanguage ?? null;

    const result = await this.translateService.translate(
      textObj,
      targetLanguage,
      from
    );

    res.json(result);
  };
}

export const translateController = new TranslateController(translateService);
