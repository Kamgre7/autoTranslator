import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { config } from '../config/default';
import { cachedFile } from './CacheHandler';
import { join } from 'node:path';

export interface IFileHandler {
  readFile(fromToTargetShortcut: string): Promise<cachedFile>;
  writeFile(data: cachedFile, fromToTargetShortcut: string): Promise<void>;
  createCacheDirectoryIfNotExist(): Promise<void>;
}

export class FileHandler implements IFileHandler {
  async readFile(fromToTargetShortcut: string): Promise<cachedFile> {
    const fileData = await readFile(
      join(config.cacheFilePath, `${fromToTargetShortcut}.json`),
      {
        encoding: 'utf-8',
      }
    );

    try {
      const parsedFileData: cachedFile = JSON.parse(fileData);

      return parsedFileData;
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }

  async writeFile(
    data: cachedFile,
    fromToTargetShortcut: string
  ): Promise<void> {
    try {
      await writeFile(
        join(config.cacheFilePath, `${fromToTargetShortcut}.json`),
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
