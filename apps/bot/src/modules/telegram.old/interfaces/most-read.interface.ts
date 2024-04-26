import { WikiMostRead } from '~/modules/wiki/interfaces';

import { BaseParams, WithHeader } from './common.interface';

export interface TgWikiMostReadParams extends BaseParams, WithHeader {
  mostread: WikiMostRead;
}
