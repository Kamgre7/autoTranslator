import { readFile, writeFile } from 'node:fs/promises';
import { config } from '../config/default';
import { cachedFile } from './CacheTranslator';

export interface IFileHandler {
  readFile(): Promise<cachedFile>;
  writeFile(data: cachedFile): Promise<void>;
}

export class FileHandler implements IFileHandler {
  async readFile(): Promise<cachedFile> {
    const file = await readFile(config.cacheFilePath, {
      encoding: 'utf-8',
    });

    const parsedFile: cachedFile = JSON.parse(file);

    return parsedFile;
  }

  async writeFile(data: cachedFile): Promise<void> {
    try {
      await writeFile(config.cacheFilePath, JSON.stringify(data));
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export const fileHandler = new FileHandler();
