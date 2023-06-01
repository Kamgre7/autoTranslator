import { readFile, writeFile } from 'node:fs/promises';
import { config } from '../config/default';
import { cachedFile } from './CacheTranslator';

export interface IFileOperations {
  readFile(): Promise<cachedFile>;
  writeFile(data: cachedFile): Promise<void>;
}

export class FileOperations implements IFileOperations {
  async readFile(): Promise<cachedFile> {
    try {
      const file = await readFile(config.cacheFilePath, {
        encoding: 'utf-8',
      });

      const parsedFile: cachedFile = JSON.parse(file);

      return parsedFile;
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.writeFile({});

        return {};
      }
      throw new Error((error as Error).message);
    }
  }

  async writeFile(data: cachedFile): Promise<void> {
    try {
      await writeFile(config.cacheFilePath, JSON.stringify(data));
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export const fileOperations = new FileOperations();
