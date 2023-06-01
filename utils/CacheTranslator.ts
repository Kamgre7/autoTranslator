export type cachedPhrases = [string, string][];
export type cachedFile = Record<string, cachedPhrases>;

export interface ICacheTranslator {
  data: cachedFile;

  findAllPhrasesByLanguages(fromToTargetShortcut: string): cachedPhrases;
  findPhrase(fromToTargetShortcut: string, text: string): string | null;
  createNewCategory(fromToTargetShortcut: string): void;
  addPhrase(
    text: string,
    translatedText: string,
    fromToTargetShortcut: string
  ): void;
}

export class CacheTranslator implements ICacheTranslator {
  constructor(public readonly data: cachedFile) {}

  findAllPhrasesByLanguages(fromToTargetShortcut: string): cachedPhrases {
    return this.data[fromToTargetShortcut];
  }

  findPhrase(fromToTargetShortcut: string, text: string): string | null {
    const phrases = this.findAllPhrasesByLanguages(fromToTargetShortcut);

    if (phrases) {
      const phrase = phrases.find(
        ([phraseFrom, translatedPhrase]) => phraseFrom === text
      );

      return phrase ? phrase[1] : null;
    }

    this.createNewCategory(fromToTargetShortcut);
    return null;
  }

  createNewCategory(fromToTargetShortcut: string): void {
    this.data[fromToTargetShortcut] = [];
  }

  addPhrase(
    text: string,
    translatedText: string,
    fromToTargetShortcut: string
  ): void {
    this.data[fromToTargetShortcut].push([text, translatedText]);
  }
}
