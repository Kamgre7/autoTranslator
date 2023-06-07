import { objectToTranslate } from '../controllers/TranslateController';
import { cachedPhrases } from './CacheTranslator';

export const convertArrayToObject = (array: cachedPhrases): objectToTranslate =>
  array.reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key]: value,
    }),
    {}
  );
