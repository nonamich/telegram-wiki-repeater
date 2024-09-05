import { Test, TestingModule } from '@nestjs/testing';

import { WikiArticle, WikiImage, WikiOnThisDay } from './types';
import { WIKI_MAX_PAGE_ON_THIS_DAY } from './wiki.constants';
import { WikiValidator } from './wiki.validator';

const fakeImage: WikiImage = {
  height: 1,
  width: 1,
  source: '',
};
const fakePage: WikiArticle = {
  content_urls: {
    desktop: {
      page: '',
    },
  },
  extract_html: '',
  pageid: 1,
  titles: {
    normalized: '',
  },
  description: '',
  originalimage: fakeImage,
  thumbnail: fakeImage,
};

const fakeOnthisday: WikiOnThisDay = {
  text: 'test',
  year: new Date().getFullYear(),
  pages: [],
};

describe('WikiValidator', () => {
  let service: WikiValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WikiValidator],
    }).compile();

    service = module.get<WikiValidator>(WikiValidator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should deleted duplicate events', () => {
    const data = [
      { ...fakeOnthisday, pages: [fakePage] },
      { ...fakeOnthisday, pages: [fakePage] },
    ];

    service.deleteUselessOnthisday(data);

    expect(data).toHaveLength(1);
  });

  describe('should deleted useless pages', () => {
    it('should deleted year page', () => {
      const pages = [
        {
          ...fakePage,
          titles: {
            normalized: '2024 ',
          },
        },
      ];

      service.deleteUselessPage([{ ...fakeOnthisday, pages }]);

      expect(pages).toHaveLength(0);
    });

    it('should trim pages array', () => {
      const pages = Array(WIKI_MAX_PAGE_ON_THIS_DAY * 2).fill(fakePage);

      service.deleteUselessPage([{ ...fakeOnthisday, pages }]);

      expect(pages.length).toBeLessThanOrEqual(WIKI_MAX_PAGE_ON_THIS_DAY);
    });
  });
});
