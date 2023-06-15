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
  cacheDataAndToTranslate: SplittedPhrases;

  translate(
    textObj: ObjectToTranslate,
    targetLanguage: string,
    fromLanguage: string | null
  ): Promise<ObjectToTranslate>;

  translatePhrasesFromApi(
    cacheHandler: ICacheHandler,
    targetLanguage: string,
    fromToShortcut: string
  ): Promise<CachedPhrases>;

  regroupPhrases(
    keyValuePairs: [string, string][],
    cacheHandler: ICacheHandler,
    fromToShortcut: string
  ): void;
}

export type SplittedPhrases = {
  fromCache: [string, string][];
  toTranslate: [string, string][];
};

export class TranslateService implements ITranslateService {
  cacheDataAndToTranslate: SplittedPhrases = {
    fromCache: [],
    toTranslate: [],
  };

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

    this.regroupPhrases(translateKeyValuePairs, cacheHandler, fromToShortcut);

    if (
      this.cacheDataAndToTranslate.fromCache.length ===
      translateKeyValuePairs.length
    ) {
      return convertArrayToObject(this.cacheDataAndToTranslate.fromCache);
    }

    const translatedPhrasesFromApi = await this.translatePhrasesFromApi(
      cacheHandler,
      targetLanguage,
      fromToShortcut
    );

    await fileHandler.writeFile(cacheHandler.data, fromToShortcut);

    const translateResult = convertArrayToObject([
      ...this.cacheDataAndToTranslate.fromCache,
      ...translatedPhrasesFromApi,
    ]);

    this.clearTmpData();

    return translateResult;
  }

  regroupPhrases(
    keyValuePairs: [string, string][],
    cacheHandler: ICacheHandler,
    fromToShortcut: string
  ): void {
    keyValuePairs.forEach(([key, text]) => {
      const phrase = cacheHandler.findPhrase(fromToShortcut, text);

      phrase
        ? this.cacheDataAndToTranslate.fromCache.push([key, phrase])
        : this.cacheDataAndToTranslate.toTranslate.push([key, text]);
    });
  }

  async translatePhrasesFromApi(
    cacheHandler: ICacheHandler,
    targetLanguage: string,
    fromToShortcut: string
  ): Promise<CachedPhrases> {
    return await Promise.all(
      this.cacheDataAndToTranslate.toTranslate.map(async ([key, text]) => {
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

  private clearTmpData() {
    this.cacheDataAndToTranslate.fromCache.length = 0;
    this.cacheDataAndToTranslate.toTranslate.length = 0;
  }
}

export const translateService = new TranslateService(translator);
