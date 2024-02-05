import { WikiNews } from '~/modules/wiki/interfaces';

import { BaseParams, WithHeader } from './common.interface';

export interface TgWikiNewsParams extends BaseParams, WithHeader {
  news: WikiNews[];
}
