import { WikiArticle } from '~/modules/wiki/interfaces';

import { BaseParams, WithBeforeTitle, WithTags } from './common.interface';

export interface TgWikiListParams
  extends BaseParams,
    WithBeforeTitle,
    WithTags {
  articles: WikiArticle[];
}
