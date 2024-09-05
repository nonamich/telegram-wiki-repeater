import sanitizeHtml from 'sanitize-html';
import truncateHtml from 'truncate-html';

import {
  TELEGRAM_MAX_CONTENT_LENGTH,
  TELEGRAM_ALLOWED_TAGS,
  TELEGRAM_DANGEROUSLY_HTML_TAG,
} from '~/modules/telegram/telegram.constants';
import { useI18n } from '~/modules/telegram/views/hooks';
import { WikiSites } from '~/modules/wiki/wiki.helper';

export class TelegramViewsUtils {
  static getSanitizedHTML(html: string) {
    const { language } = useI18n();

    return sanitizeHtml(html, {
      allowedTags: TELEGRAM_ALLOWED_TAGS,
      transformTags: {
        [TELEGRAM_DANGEROUSLY_HTML_TAG]: sanitizeHtml.simpleTransform('', {}),
        a: (tagName, attribs) => {
          if (attribs.href && attribs.rel === 'mw:WikiLink') {
            const urlObj = new URL(
              attribs.href,
              WikiSites.getBaseURL(language),
            );

            attribs.href = urlObj.toString();
          }

          return {
            tagName,
            attribs,
          };
        },
      },
    });
  }

  static truncateHtml(content: string, ellipsis = '...') {
    return truncateHtml(content, {
      keepWhitespaces: true,
      length: TELEGRAM_MAX_CONTENT_LENGTH,
      ellipsis,
    });
  }
}
