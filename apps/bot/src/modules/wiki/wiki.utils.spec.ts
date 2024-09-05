import { Test, TestingModule } from '@nestjs/testing';

import { WikiUtils } from './wiki.utils';

describe('WikiUtils', () => {
  let service: WikiUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WikiUtils],
    }).compile();

    service = module.get<WikiUtils>(WikiUtils);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('method: prepareParams', () => {
    const unsanitizeParams = {
      date: new Date(),
      string: 'string',
      mustBeString: 9,
      nine: 10,
    };

    const sanitizeParams = service.prepareParams(unsanitizeParams);

    expect(typeof sanitizeParams.mustBeString).toEqual('string');
    expect(sanitizeParams.mustBeString).toEqual('09');
    expect(sanitizeParams.nine).toEqual('10');
    expect(typeof sanitizeParams.string).toEqual('string');
    expect(sanitizeParams.date).toBeInstanceOf(Date);
  });

  it('test compress', () => {
    const date = new Date();
    const originalData = {
      string: 'string',
      number: 0,
      boolean: true,
      null: null,
      date,
    };

    const compressed = service.cacheCompressSync(originalData);
    const decompressed = service.cacheDecompressSync(compressed);

    expect(decompressed).toEqual({ ...originalData, date: date.toJSON() });
  });
});
