import { WithLang } from '~/modules/telegram/interfaces';

import { WikiArticle } from '.';

export interface WikiOnThisDay {
  text: string;
  pages: WikiArticle[];
  year?: number;
  source?: 'event' | 'holiday';
}

export interface OnThisDayRequest extends WithLang {
  day: number;
  month: number;
}

export interface OnThisDayResponse {
  births?: WikiOnThisDay[];
  deaths?: WikiOnThisDay[];
  events?: WikiOnThisDay[];
  holidays?: WikiOnThisDay[];
  selected?: WikiOnThisDay[];
}
