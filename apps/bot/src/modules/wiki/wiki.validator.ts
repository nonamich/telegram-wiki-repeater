import { Injectable } from '@nestjs/common';

import { WikiArticle, WikiOnThisDay } from './types';
import { WIKI_MAX_PAGE_ON_THIS_DAY } from './wiki.constants';

@Injectable()
export class WikiValidator {
  deleteUselessOnthisday(events: WikiOnThisDay[]) {
    const ids = new Set<number>();

    for (const event of events) {
      for (const [index, { pageid }] of event.pages.entries()) {
        if (ids.has(pageid)) {
          events.splice(index, 1);
        }

        ids.add(pageid);
      }
    }
  }

  deleteUselessPage(onthisday: WikiOnThisDay[]) {
    for (const { pages, year } of onthisday) {
      for (const [index, page] of pages.entries()) {
        if (this.isYearPage(year, page)) {
          pages.splice(index, 1);
        }
      }

      pages.splice(WIKI_MAX_PAGE_ON_THIS_DAY);
    }
  }

  isYearPage(year: number, { titles: { normalized: title } }: WikiArticle) {
    return new RegExp(`^${year}`).test(title);
  }
}
