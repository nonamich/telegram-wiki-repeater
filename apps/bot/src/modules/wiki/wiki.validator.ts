import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/aws-serverless';
import { stringSimilarity } from 'string-similarity-js';

import { WikiArticle, WikiOnThisDay } from './types';
import { WIKI_MAX_PAGE_ON_THIS_DAY } from './wiki.constants';

@Injectable()
export class WikiValidator {
  getEventSimilarity(eventA: WikiOnThisDay, eventB: WikiOnThisDay) {
    return stringSimilarity(eventA.text, eventB.text);
  }

  checkEventSimilarity(similarity: number) {
    return similarity >= 0.7;
  }

  deleteUselessOnthisday(events: WikiOnThisDay[]) {
    return events
      .filter((eventA, index) => {
        return events.findIndex(({ text }) => eventA.text === text) === index;
      })
      .reduce<WikiOnThisDay[]>((acc, eventA) => {
        const similarityEvent = acc.find((eventB) =>
          this.checkEventSimilarity(this.getEventSimilarity(eventA, eventB)),
        );

        if (similarityEvent) {
          Sentry.captureMessage('Similarity', {
            extra: {
              a: eventA.text,
              b: similarityEvent.text,
            },
          });
        } else {
          acc.push(eventA);
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
