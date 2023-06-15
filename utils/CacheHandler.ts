export type CachedPhrases = [string, string][];
export type CachedFileData = Record<string, CachedPhrases>;

export interface ICacheHandler {
  data: CachedFileData;

  findAllPhrasesByLanguages(fromToTargetShortcut: string): CachedPhrases;
  findPhrase(fromToTargetShortcut: string, text: string): string | null;
  addPhrase(
    text: string,
    translatedText: string,
    fromToTargetShortcut: string
  ): void;
}

export class CacheHandler implements ICacheHandler {
  constructor(public readonly data: CachedFileData) {}

  findAllPhrasesByLanguages(fromToTargetShortcut: string): CachedPhrases {
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

  addPhrase(
    text: string,
    translatedText: string,
    fromToTargetShortcut: string
  ): void {
    this.data[fromToTargetShortcut].push([text, translatedText]);
  }

  private createNewCategory(fromToTargetShortcut: string): void {
    this.data[fromToTargetShortcut] = [];
  }
}
