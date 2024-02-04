import { WikiNews } from '~/modules/wiki/interfaces';

import { BaseParams, WithBeforeTitle } from './common.interface';

export interface TgWikiNewsParams extends BaseParams, WithBeforeTitle {
  news: WikiNews[];
}
