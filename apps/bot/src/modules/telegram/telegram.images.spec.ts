import { Test, TestingModule } from '@nestjs/testing';

import { GlobalModule } from '~/modules/global.module';
import { ImagesModule } from '~/modules/images/images.module';
import { WikiArticle, WikiImage } from '~/modules/wiki/types';

import { TelegramImages } from './telegram.images';

const fakeImage: WikiImage = {
  height: 700,
  width: 1024,
  source:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/James_Webb_Primary_Mirror.jpg/1024px-James_Webb_Primary_Mirror.jpg',
};
const fakeArticle: WikiArticle = {
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
};

describe('TelegramImages', () => {
  let service: TelegramImages;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramImages],
      imports: [GlobalModule, ImagesModule],
    }).compile();

    service = module.get<TelegramImages>(TelegramImages);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getFirstImageFromArticles', async () => {
    const image = await service.getFirstImageFromArticles([
      fakeArticle,
      fakeArticle,
      { ...fakeArticle, originalimage: fakeImage, thumbnail: fakeImage },
    ]);

    expect(image).toBeDefined();
    expect(typeof image).toEqual('string');
  });

  it('isInBlackList', () => {
    const isInBlackList = service.isInBlackList({
      height: 100,
      width: 100,
      source:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Adolf_Hitler_cropped_restored.jpg/280px-Adolf_Hitler_cropped_restored.jpg',
    });
    const isInWhiteList = service.isInBlackList(fakeImage);

    expect(isInBlackList).toBe(true);
    expect(isInWhiteList).toBe(false);
  });
});
