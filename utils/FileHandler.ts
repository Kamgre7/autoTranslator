import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { config } from '../config/default';
import { cachedFile } from './CacheTranslator';
import { join } from 'node:path';

export interface IFileHandler {
  readFile(fromToTargetShortcut: string): Promise<cachedFile>;
  writeFile(data: cachedFile, fromToTargetShortcut: string): Promise<void>;
  createCacheDirectoryIfNotExist(): Promise<void>;
}

export class FileHandler implements IFileHandler {
  async readFile(fromToTargetShortcut: string): Promise<cachedFile> {
    const file = await readFile(
      join(config.cacheFilePath, `${fromToTargetShortcut}.json`),
      {
        encoding: 'utf-8',
      }
    );

    const parsedFile: cachedFile = JSON.parse(file);

    return parsedFile;
  }

  async writeFile(
    data: cachedFile,
    fromToTargetShortcut: string
  ): Promise<void> {
    try {
      await writeFile(
        `${config.cacheFilePath}/${fromToTargetShortcut}.json`,
        JSON.stringify(data)
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async createCacheDirectoryIfNotExist(): Promise<void> {
    try {
      await mkdir(config.cacheFilePath, { recursive: true });
    } catch (error) {
      console.error((error as Error).message);
    }
  }
}

export const fileHandler = new FileHandler();
