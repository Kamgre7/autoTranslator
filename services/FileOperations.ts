import { readFile, writeFile } from 'node:fs/promises';
import { config } from '../config/default';

export type cachedPhrases = [string, string][];
export type cacheFile = Map<string, cachedPhrases>;

export interface IFileOperations {
  readFile(): Promise<cacheFile>;
  writeFile(data: string): Promise<void>;
}

export class FileOperations implements IFileOperations {
  async readFile(): Promise<cacheFile> {
    try {
      const file = await readFile(config.cacheFilePath, { encoding: 'utf-8' });
      const parsedFile: cacheFile = JSON.parse(file);

      return parsedFile;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async writeFile(data: string): Promise<void> {
    try {
      await writeFile(config.cacheFilePath, data);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export const cacheFileOperations = new FileOperations();
