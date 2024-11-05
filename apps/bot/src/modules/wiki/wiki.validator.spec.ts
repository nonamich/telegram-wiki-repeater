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
    const events = [
      {
        ...fakeOnthisday,
        text: 'Відкриття тролейбусного руху в Чернігові.',
        pages: [fakePage],
      },
      {
        ...fakeOnthisday,
        text: 'Перша тестова телетрансляція з Київського телецентру на Хрещатику, 26',
        pages: [fakePage],
      },
      {
        ...fakeOnthisday,
        text: 'Велика Британія анексувала Кіпр і разом з Французькою республікою оголосила війну Османській Імперії.',
        pages: [fakePage],
      },
      {
        ...fakeOnthisday,
        text: 'Британія анексувала Кіпр і разом з Францією оголосила війну Османській Імперії',
        pages: [fakePage],
      },
    ];

    const newEvents = service.deleteUselessOnthisday(events);

    expect(newEvents).toHaveLength(3);
  });

  describe('should deleted useless pages', () => {
    it('should deleted year page', () => {
      const events = [
        {
          ...fakeOnthisday,
          pages: [
            {
              ...fakePage,
              titles: {
                normalized: `${new Date().getFullYear()} `,
              },
            },
          ],
        },
      ];

      const [event] = service.deleteUselessPage(events);

      expect(event.pages).toHaveLength(0);
    });

    it('should trim pages array', () => {
      const pages = Array(WIKI_MAX_PAGE_ON_THIS_DAY * 2).fill(fakePage);
      const events = [
        {
          ...fakeOnthisday,
          pages,
        },
      ];

      const [event] = service.deleteUselessPage(events);

      expect(event.pages.length).toBeLessThanOrEqual(WIKI_MAX_PAGE_ON_THIS_DAY);
    });
  });
});
