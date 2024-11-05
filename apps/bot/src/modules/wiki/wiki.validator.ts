import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/aws-serverless';
import { stringSimilarity } from 'string-similarity-js';

import { WikiArticle, WikiOnThisDay } from './types';
import { WIKI_MAX_PAGE_ON_THIS_DAY } from './wiki.constants';

@Injectable()
export class WikiValidator {
  deleteUselessOnthisday(events: WikiOnThisDay[]) {
    return events.reduce<WikiOnThisDay[]>((acc, eventA) => {
      const duplicate = acc.find((eventB) => {
        const likely = stringSimilarity(eventA.text, eventB.text);

        return likely >= 0.7;
      });

      if (!duplicate) {
        acc.push(eventA);
      } else {
        Sentry.captureMessage(`${eventA.text} ${duplicate.text}`);
      }

      return acc;
    }, []);
  }

  deleteUselessPage(onthisday: WikiOnThisDay[]) {
    return onthisday.map((event) => {
      event.pages = event.pages.filter((page) => {
        return !this.isYearPage(event.year, page);
      });

      event.pages.splice(WIKI_MAX_PAGE_ON_THIS_DAY);

      return event;
    });
  }

  isYearPage(year: number, { titles: { normalized: title } }: WikiArticle) {
    return new RegExp(`^${year}`).test(title);
  }
}
