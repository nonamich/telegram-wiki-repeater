import sanitizeHtml from 'sanitize-html';
import truncateHtml from 'truncate-html';

import { useI18n } from '~/modules/i18n/i18n.utils';
import {
  TELEGRAM_MAX_CONTENT_LENGTH,
  TELEGRAM_ALLOWED_TAGS,
  TELEGRAM_TAG_DANGEROUSLY_HTML,
} from '~/modules/telegram/telegram.constants';
import { WikiHelper } from '~/modules/wiki/wiki.helper';

export class TelegramViewsUtils {
  static getSanitizedHTML(html: string) {
    const { language } = useI18n();

    return sanitizeHtml(html, {
      allowedTags: TELEGRAM_ALLOWED_TAGS,
      transformTags: {
        [TELEGRAM_TAG_DANGEROUSLY_HTML]: sanitizeHtml.simpleTransform('', {}),
        a: (tagName, attribs) => {
          if (attribs.href && attribs.rel === 'mw:WikiLink') {
            const urlObj = new URL(
              attribs.href,
              WikiHelper.getBaseURL(language),
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
