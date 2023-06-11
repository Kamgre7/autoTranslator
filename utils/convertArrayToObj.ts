import { ObjectToTranslate } from '../controllers/TranslateController';
import { cachedPhrases } from './CacheHandler';

export const convertArrayToObject = (array: cachedPhrases): ObjectToTranslate =>
  array.reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key]: value,
    }),
    {}
  );
