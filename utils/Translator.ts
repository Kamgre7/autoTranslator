import { Translate } from '@google-cloud/translate/build/src/v2';
import { config } from '../config/default';

export interface ITranslator {
  translate: Translate;
  detectLanguage(text: string): Promise<string>;
  translateText(text: string, targetLanguage: string): Promise<string>;
}

export class Translator implements ITranslator {
  constructor(public translate: Translate) {}

  async detectLanguage(text: string): Promise<string> {
    try {
      const [detectResult] = await this.translate.detect(text);

      return detectResult.language;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const [response] = await this.translate.translate(text, targetLanguage);

      return response;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

export const translator = new Translator(
  new Translate({
    credentials: config.googleCloud,
    projectId: config.googleCloud.project_id,
  })
);
