import { WikiOnThisDay } from '~/modules/wiki/interfaces';

import { BaseParams } from './common.interface';

export interface TgWikiOnThisDayParams extends BaseParams {
  onthisday: WikiOnThisDay[];
}
