import { WikiMostRead } from '~/modules/wiki/interfaces';

import { BaseParams, WithBeforeTitle } from './common.interface';

export interface TgWikiMostReadParams extends BaseParams, WithBeforeTitle {
  mostread: WikiMostRead;
}
