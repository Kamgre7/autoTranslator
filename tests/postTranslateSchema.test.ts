import {
  PostTranslateBody,
  PostTranslateSchema,
} from '../schemas/postTranslateSchema';

describe('Post translate schema', () => {
  let postTranslateBody: {
    textObj: {
      text: unknown;
      text2: unknown;
    };
    targetLanguage: unknown;
    fromLanguage: unknown;
  };

  let postTranslate: {
    body: typeof postTranslateBody;
  };

  beforeEach(() => {
    postTranslateBody = {
      textObj: {
        text: 'First',
        text2: 'Second',
      },
      targetLanguage: 'de',
      fromLanguage: 'en',
    };

    postTranslate = {
      body: postTranslateBody,
    };
  });

  describe('PostTranslateBody Schema', () => {
    it('Should return true - all values are string type', () => {
      const dataParse = PostTranslateBody.safeParse(postTranslateBody);

      expect(dataParse.success).toBeTruthy();
    });

    it('Should return false - targetLanguage must be a string', () => {
      postTranslateBody.targetLanguage = 1;

      const dataParse = PostTranslateBody.safeParse(postTranslateBody);

      expect(dataParse.success).toBeFalsy();
    });

    it('Should return false - fromLanguage must be a string or null', () => {
      postTranslateBody.targetLanguage = undefined;

      const dataParse = PostTranslateBody.safeParse(postTranslateBody);

      expect(dataParse.success).toBeFalsy();
    });

    it('Should return false - all textObj values must be a string', () => {
      postTranslateBody.textObj.text = null;

      const dataParse = PostTranslateBody.safeParse(postTranslateBody);

      expect(dataParse.success).toBeFalsy();
    });
  });

  describe('PostTranslateSchema', () => {
    it('Should return true - body values are string type', () => {
      const dataParse = PostTranslateSchema.safeParse(postTranslate);

      expect(dataParse.success).toBeTruthy();
    });

    it('Should return false - fromLanguage must be string', () => {
      postTranslate.body.fromLanguage = 1;

      const dataParse = PostTranslateSchema.safeParse(postTranslate);

      expect(dataParse.success).toBeFalsy();
    });

    it('Should return false -  body cannot be null', () => {
      const data = {
        body: null,
      };

      const dataParse = PostTranslateSchema.safeParse(data);

      expect(dataParse.success).toBeFalsy();
    });
  });

  describe('Should throw error when', () => {
    it('Should throw error when body is missing required keys', () => {
      delete postTranslate.body.targetLanguage;

      expect(() => {
        PostTranslateSchema.parse(postTranslate);
      }).toThrow();
    });
  });
});
