import { Request, Response } from 'express';
import {
  ITranslateService,
  translateService,
} from '../services/TranslateService';

export type objectToTranslate = {
  [key: string]: string;
};

export type reqBody = {
  textObj: objectToTranslate;
  targetLanguage: string;
  fromLanguage?: string;
};

export interface ITranslateController {
  postTranslate(req: Request, res: Response): Promise<void>;
}

export class TranslateController implements ITranslateController {
  constructor(private readonly translateService: ITranslateService) {}

  postTranslate = async (req: Request, res: Response): Promise<void> => {
    const { textObj, targetLanguage, fromLanguage }: reqBody = req.body;

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
