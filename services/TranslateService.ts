import { fileHandler } from '../utils/FileHandler';
import {
  CacheTranslator,
  cachedFile,
  cachedPhrases,
} from '../utils/CacheTranslator';
import { ITranslator, translator } from '../utils/Translator';
import { ObjectToTranslate } from '../controllers/TranslateController';
import { convertArrayToObject } from '../utils/convertArrayToObj';

export interface ITranslateService {
  translate(
    textObj: ObjectToTranslate,
    targetLanguage: string,
    fromLanguage: string | null
  ): Promise<ObjectToTranslate>;
}

export class TranslateService implements ITranslateService {
  constructor(private readonly translator: ITranslator) {}

  async translate(
    textObj: ObjectToTranslate,
    targetLanguage: string,
    fromLanguage: string | null
  ): Promise<ObjectToTranslate> {
    const translateKeyValue = Object.entries(textObj);
    const firstSentenceToDetectLanguage = translateKeyValue[0][1];

    const from = await this.findLanguageFrom(
      fromLanguage,
      firstSentenceToDetectLanguage
    );

    const fromToTargetShortcut = `${from}-${targetLanguage}`;

    await fileHandler.createCacheDirectoryIfNotExist();

    const cacheFileData = await this.readCacheFileOrCreate(
      fromToTargetShortcut
    );

    const cacheTranslator = new CacheTranslator(cacheFileData);

    const translatedPhrases: cachedPhrases = await Promise.all(
      translateKeyValue.map(async ([key, text]) => {
        const phrase = cacheTranslator.findPhrase(fromToTargetShortcut, text);

        if (phrase) {
          return [key, phrase];
        }

        const translatePhrase = await this.translator.translateText(
          text,
          targetLanguage
        );

        cacheTranslator.addPhrase(text, translatePhrase, fromToTargetShortcut);

        return [key, translatePhrase];
      })
    );

    await fileHandler.writeFile(cacheTranslator.data, fromToTargetShortcut);

    return convertArrayToObject(translatedPhrases);
  }

  private async findLanguageFrom(
    fromReqBody: string | null,
    firstSentence: string
  ): Promise<string> {
    return fromReqBody
      ? fromReqBody
      : await this.translator.detectLanguage(firstSentence);
  }

  private async readCacheFileOrCreate(
    fromToTargetShortcut: string
  ): Promise<cachedFile> {
    try {
      return await fileHandler.readFile(fromToTargetShortcut);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await fileHandler.writeFile({}, fromToTargetShortcut);

        return {};
      }
      throw new Error((error as Error).message);
    }
  }
}

export const translateService = new TranslateService(translator);
