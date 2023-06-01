import { fileOperations } from '../utils/FileOperations';
import { CacheTranslator } from '../utils/CacheTranslator';
import { ITranslator, Translator } from '../utils/Translator';

export interface ITranslateService {
  translate(
    text: string,
    targetLanguage: string,
    fromLanguage: string | null
  ): Promise<string>;
}

export class TranslateService implements ITranslateService {
  constructor(private readonly translator: ITranslator) {}

  async translate(
    text: string,
    targetLanguage: string,
    fromLanguage: string | null
  ): Promise<string> {
    try {
      const from = fromLanguage ?? (await this.translator.detectLanguage(text));
      const fromToTargetShortcut = `${from}-${targetLanguage}`;

      const cacheFileData = await fileOperations.readFile();
      const cacheTranslator = new CacheTranslator(cacheFileData);

      const phrase = cacheTranslator.findPhrase(fromToTargetShortcut, text);

      if (phrase) {
        return phrase;
      }

      const translatePhrase = await this.translator.translateText(
        text,
        targetLanguage
      );

      cacheTranslator.addPhrase(text, translatePhrase, fromToTargetShortcut);

      await fileOperations.writeFile(cacheTranslator.data);

      return translatePhrase;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

export const translateService = new TranslateService(new Translator());
