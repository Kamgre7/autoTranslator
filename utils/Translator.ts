import { Translate } from '@google-cloud/translate/build/src/v2';
import { config } from '../config/default';

export interface ITranslator {
  detectLanguage(text: string): Promise<string>;
  translateText(text: string, targetLanguage: string): Promise<string>;
}

const CREDENTIALS = config.googleCloud;

const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

export class Translator implements ITranslator {
  async detectLanguage(text: string): Promise<string> {
    try {
      const [detectResult] = await translate.detect(text);

      return detectResult.language;
    } catch (err) {
      console.error((err as Error).message);
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const [response] = await translate.translate(text, targetLanguage);

      return response;
    } catch (err) {
      console.error((err as Error).message);
    }
  }
}

export const translator = new Translator();
