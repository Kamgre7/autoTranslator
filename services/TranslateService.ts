import { fileHandler } from '../utils/FileHandler';
import { CacheHandler, cachedFile, cachedPhrases } from '../utils/CacheHandler';
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
    const translateKeyValuePairs = Object.entries(textObj);
    const firstSentenceToDetectLanguage = translateKeyValuePairs[0][1];

    const from = await this.findLanguageFrom(
      fromLanguage,
      firstSentenceToDetectLanguage
    );

    const fromToShortcut = `${from}-${targetLanguage}`;

    const cacheFileData = await this.readCacheFileOrCreate(fromToShortcut);

    const cacheHandler = new CacheHandler(cacheFileData);

    const isEveryPhraseInCache = translateKeyValuePairs.every(([key, text]) =>
      cacheHandler.findPhrase(fromToShortcut, text)
    );

    if (isEveryPhraseInCache) {
      const mappedPhrases: cachedPhrases = translateKeyValuePairs.map(
        ([key, text]) => [
          key,
          cacheHandler.findPhrase(fromToShortcut, text) as string,
        ]
      );

      return convertArrayToObject(mappedPhrases);
    }

    const translatedPhrases: cachedPhrases = await Promise.all(
      translateKeyValuePairs.map(async ([key, text]) => {
        const phrase = cacheHandler.findPhrase(fromToShortcut, text);

        if (phrase) {
          return [key, phrase];
        }

        const translatePhrase = await this.translator.translateText(
          text,
          targetLanguage
        );

        cacheHandler.addPhrase(text, translatePhrase, fromToShortcut);

        return [key, translatePhrase];
      })
    );

    await fileHandler.writeFile(cacheHandler.data, fromToShortcut);

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
        await fileHandler.createCacheDirectoryIfNotExist();

        await fileHandler.writeFile({}, fromToTargetShortcut);

        return {};
      }
      throw new Error((error as Error).message);
    }
  }
}

export const translateService = new TranslateService(translator);
