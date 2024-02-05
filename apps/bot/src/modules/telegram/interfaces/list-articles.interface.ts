import { WikiArticle } from '~/modules/wiki/interfaces';

import {
  BaseParams,
  WithHeader,
  WithSource,
  WithTags,
} from './common.interface';

export interface TgWikiListParams
  extends BaseParams,
    WithHeader,
    WithTags,
    WithSource {
  articles: WikiArticle[];
}
