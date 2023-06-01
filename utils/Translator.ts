import { Translate } from '@google-cloud/translate/build/src/v2';
import { config } from '../config/default';

export interface ITranslator {
  detectLanguage(text: string): Promise<string>;
  translateText(text: string, targetLanguage: string): Promise<string>;
}

const translate = new Translate({
  credentials: config.googleCloud,
  projectId: config.googleCloud.project_id,
});

export class Translator implements ITranslator {
  async detectLanguage(text: string): Promise<string> {
    try {
      const [detectResult] = await translate.detect(text);

      return detectResult.language;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const [response] = await translate.translate(text, targetLanguage);

      return response;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

export const translator = new Translator();
