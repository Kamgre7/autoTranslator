import { fileHandler } from '../utils/FileHandler';
import {
  CacheHandler,
  CachedFileData,
  CachedPhrases,
  ICacheHandler,
} from '../utils/CacheHandler';
import { ITranslator, translator } from '../utils/Translator';
import { ObjectToTranslate } from '../controllers/TranslateController';
import { convertArrayToObject } from '../utils/convertArrayToObj';

export interface ITranslateService {
  translate(
    textObj: ObjectToTranslate,
    targetLanguage: string,
    fromLanguage: string | null
  ): Promise<ObjectToTranslate>;

  translatePhrasesFromApi(
    data: [string, string][],
    cacheHandler: ICacheHandler,
    targetLanguage: string,
    fromToShortcut: string
  ): Promise<CachedPhrases>;

  regroupPhrases(
    keyValuePairs: [string, string][],
    cacheHandler: ICacheHandler,
    fromToShortcut: string
  ): SplittedPhrases;
}

export type SplittedPhrases = {
  fromCache: [string, string][];
  toTranslate: [string, string][];
};

export class TranslateService implements ITranslateService {
  constructor(private readonly translator: ITranslator) {}

  async translate(
    textObj: ObjectToTranslate,
    targetLanguage: string,
    fromLanguage: string | null
  ): Promise<ObjectToTranslate> {
    const translateKeyValuePairs = Object.entries(textObj);
    const firstSentenceToDetectLanguage = translateKeyValuePairs[0][1];

    const from = await this.findLanguageFrom(
      fromLanguage,
      firstSentenceToDetectLanguage
    );

    const fromToShortcut = `${from}-${targetLanguage}`;

    const cacheFileData = await this.readCacheFileOrCreate(fromToShortcut);

    const cacheHandler = new CacheHandler(cacheFileData);

    const groupedPhrases = this.regroupPhrases(
      translateKeyValuePairs,
      cacheHandler,
      fromToShortcut
    );

    if (groupedPhrases.fromCache.length === translateKeyValuePairs.length) {
      return convertArrayToObject(groupedPhrases.fromCache);
    }

    const translatedPhrasesFromApi = await this.translatePhrasesFromApi(
      groupedPhrases.toTranslate,
      cacheHandler,
      targetLanguage,
      fromToShortcut
    );

    await fileHandler.writeFile(cacheHandler.data, fromToShortcut);

    const translateResult = convertArrayToObject([
      ...groupedPhrases.fromCache,
      ...translatedPhrasesFromApi,
    ]);

    return translateResult;
  }

  regroupPhrases(
    keyValuePairs: [string, string][],
    cacheHandler: ICacheHandler,
    fromToShortcut: string
  ): SplittedPhrases {
    const cacheDataAndToTranslate: SplittedPhrases = {
      fromCache: [],
      toTranslate: [],
    };

    keyValuePairs.forEach(([key, text]) => {
      const phrase = cacheHandler.findPhrase(fromToShortcut, text);

      phrase
        ? cacheDataAndToTranslate.fromCache.push([key, phrase])
        : cacheDataAndToTranslate.toTranslate.push([key, text]);
    });

    return cacheDataAndToTranslate;
  }

  async translatePhrasesFromApi(
    data: [string, string][],
    cacheHandler: ICacheHandler,
    targetLanguage: string,
    fromToShortcut: string
  ): Promise<CachedPhrases> {
    return await Promise.all(
      data.map(async ([key, text]) => {
        const phrase = await this.translator.translateText(
          text,
          targetLanguage
        );

        cacheHandler.addPhrase(text, phrase, fromToShortcut);

        return [key, phrase];
      })
    );
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
  ): Promise<CachedFileData> {
    try {
      return await fileHandler.readFile(fromToTargetShortcut);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await fileHandler.createCacheDirectoryIfNotExist();

        await fileHandler.writeFile({}, fromToTargetShortcut);

        return {};
      }
      throw new Error((error as Error).message);
    }
  }
}

export const translateService = new TranslateService(translator);
