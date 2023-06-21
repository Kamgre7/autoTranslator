import { Translate } from '@google-cloud/translate/build/src/v2';
import { ITranslator } from '../utils/Translator';
import { IFileHandler } from '../utils/FileHandler';
import {
  ITranslateService,
  TranslateService,
} from '../services/TranslateService';
import { ObjectToTranslate } from '../controllers/TranslateController';

describe('Translate service', () => {
  let translatorMock: ITranslator;
  let fileHandlerMock: IFileHandler;
  let translateService: ITranslateService;
  let toTranslate: ObjectToTranslate;

  beforeAll(() => {
    jest.mock('@google-cloud/translate/build/src/v2', () => {
      return {
        Translate: jest.fn().mockImplementation(() => ({
          detect: jest.fn().mockReturnValue('en'),
          translate: jest.fn().mockReturnValue('translated text'),
        })),
      };
    });
  });

  beforeEach(() => {
    toTranslate = {
      text1: 'Monday',
      text2: 'Tuesday',
    };

    translatorMock = {
      translate: new (Translate as jest.MockedClass<typeof Translate>)(),
      detectLanguage: jest.fn().mockResolvedValue('en'),
      translateText: jest
        .fn()
        .mockResolvedValueOnce('Montag')
        .mockResolvedValueOnce('Dienstag'),
    };

    fileHandlerMock = {
      readFile: jest.fn().mockResolvedValue({}),
      writeFile: jest.fn(),
      createCacheDirectoryIfNotExist: jest.fn(),
    };

    translateService = new TranslateService(translatorMock, fileHandlerMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Translate Service', () => {
    describe('Detect language', () => {
      it('Should call detectLanguage method when languageFrom is null', async () => {
        await translateService.translate(toTranslate, 'de', null);

        expect(translatorMock.detectLanguage).toBeCalledTimes(1);
      });

      it('Should not call detectLanguage when language is given', async () => {
        await translateService.translate(toTranslate, 'de', 'en');

        expect(translatorMock.detectLanguage).not.toBeCalled();
      });
    });

    describe('Translator API', () => {
      it('Should call translator API, when cache data does not exist', async () => {
        await translateService.translate(toTranslate, 'de', 'en');

        expect(translatorMock.translateText).toBeCalledTimes(2);
      });

      it('Should not call translator API, when data from cache match the query ', async () => {
        fileHandlerMock.readFile = jest.fn().mockResolvedValue({
          'en-de': [
            ['Monday', 'Montag'],
            ['Tuesday', 'Dienstag'],
          ],
        });

        await translateService.translate(toTranslate, 'de', 'en');

        expect(translatorMock.translateText).not.toBeCalled();
      });

      it('Should call translator API once, when data from cache match only one query', async () => {
        fileHandlerMock.readFile = jest.fn().mockResolvedValue({
          'en-de': [['Tuesday', 'Dienstag']],
        });

        await translateService.translate(toTranslate, 'de', 'en');

        expect(translatorMock.translateText).toBeCalledTimes(1);
      });
    });

    describe('FileHandler', () => {
      it('Should call only once readFile', async () => {
        await translateService.translate(toTranslate, 'de', 'en');

        expect(fileHandlerMock.readFile).toBeCalledTimes(1);
      });

      it('Should call only once writeFile', async () => {
        await translateService.translate(toTranslate, 'de', 'en');

        expect(fileHandlerMock.writeFile).toBeCalledTimes(1);
      });
    });
  });
});
