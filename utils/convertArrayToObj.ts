import { ObjectToTranslate } from '../controllers/TranslateController';
import { CachedPhrases } from './CacheHandler';

export const convertArrayToObject = (array: CachedPhrases): ObjectToTranslate =>
  array.reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key]: value,
    }),
    {}
  );
