import { WikiOnThisDay } from '~/modules/wiki/interfaces';

import { BaseParams, WithBeforeTitle } from './common.interface';

export interface TgWikiOnThisDayParams extends BaseParams, WithBeforeTitle {
  onthisday: WikiOnThisDay[];
}
