import { WikiOnThisDay } from '~/modules/wiki/interfaces';

import { BaseParams, WithHeader } from './common.interface';

export interface TgWikiOnThisDayParams extends BaseParams, WithHeader {
  onthisday: WikiOnThisDay[];
}
