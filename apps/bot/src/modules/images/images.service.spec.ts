import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { GlobalModule } from '~/modules/global.module';

import { ImagesService } from './images.service';

const imageURL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/James_Webb_Primary_Mirror.jpg/1024px-James_Webb_Primary_Mirror.jpg';

describe('ImagesService', () => {
  let service: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GlobalModule, HttpModule],
      providers: [ImagesService],
      exports: [ImagesService],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getContentLength', async () => {
    const contentLength = await service.getContentLength(imageURL);

    expect(contentLength).toBeDefined();
    expect(contentLength).toBeGreaterThan(0);
    await expect(async () => {
      await service.getContentLength('');
    }).rejects.toThrow();
  });
});
