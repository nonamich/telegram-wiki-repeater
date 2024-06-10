import path from 'node:path';

import sanitizeHtml from 'sanitize-html';
import truncateHtml from 'truncate-html';

import { useI18n } from '~/modules/i18n/i18n.utils';
import {
  MAX_CONTENT_LENGTH,
  TELEGRAM_ALLOWED_TAGS,
  TELEGRAM_TAG_DANGEROUSLY_HTML,
} from '~/modules/telegram/telegram.constants';

export class TelegramViewsUtils {
  static getSanitizedHTML(html: string) {
    const i18n = useI18n();

    return sanitizeHtml(html, {
      allowedTags: TELEGRAM_ALLOWED_TAGS,
      transformTags: {
        [TELEGRAM_TAG_DANGEROUSLY_HTML]: sanitizeHtml.simpleTransform('', {}),
        a: (tagName, attribs) => {
          if (attribs.href && attribs.rel === 'mw:WikiLink') {
            const urlObj = new URL(
              `https://${i18n.language}.m.wikipedia.org/wiki/`,
            );

            urlObj.pathname = path.join(urlObj.pathname, attribs.href);

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

  static getPreparedContent(content: string, ellipsis = '...') {
    return truncateHtml(content, {
      keepWhitespaces: true,
      length: MAX_CONTENT_LENGTH,
      ellipsis,
    });
  }
}
