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
  let objToTranslate: ObjectToTranslate;
  let translateInstance: Translate;

  beforeEach(() => {
    objToTranslate = {
      text1: 'Monday',
      text2: 'Tuesday',
    };

    translateInstance = new Translate();
    translateInstance.translate = jest.fn();

    translatorMock = {
      translate: translateInstance,
      translateText: jest
        .fn()
        .mockResolvedValueOnce('Montag')
        .mockResolvedValueOnce('Dienstag'),
      detectLanguage: jest.fn().mockResolvedValue('en'),
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
      it('Should call method when languageFrom is null', () => {
        translateService.translate(objToTranslate, 'de', null);

        expect(translatorMock.detectLanguage).toBeCalledTimes(1);
      });

      it('Should not call when language is given', () => {
        translateService.translate(objToTranslate, 'de', 'en');

        expect(translatorMock.detectLanguage).not.toBeCalled();
      });
    });
  });
});
