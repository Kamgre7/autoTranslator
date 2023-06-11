export type cachedPhrases = [string, string][];
export type cachedFile = Record<string, cachedPhrases>;

export interface ICacheHandler {
  data: cachedFile;

  findAllPhrasesByLanguages(fromToTargetShortcut: string): cachedPhrases;
  findPhrase(fromToTargetShortcut: string, text: string): string | null;
  addPhrase(
    text: string,
    translatedText: string,
    fromToTargetShortcut: string
  ): void;
}

export class CacheHandler implements ICacheHandler {
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
