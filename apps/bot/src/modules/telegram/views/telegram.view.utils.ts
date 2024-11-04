import sanitizeHtml, {
  IOptions as SanitizeOptions,
  Attributes as SanitizeAttributes,
} from 'sanitize-html';
import truncateHtml from 'truncate-html';

import {
  TELEGRAM_MAX_CONTENT_LENGTH,
  TELEGRAM_ALLOWED_TAGS,
  TELEGRAM_TAGS_TO_UNWRAP,
} from '~/modules/telegram/telegram.constants';
import { useI18n } from '~/modules/telegram/views/hooks';
import { WikiSites } from '~/modules/wiki/wiki.sites';

export class TelegramViewsUtils {
  static getSanitizedHTML(html: string) {
    return sanitizeHtml(html, this.getSanitizedOptions());
  }

  static getSanitizedOptions(): SanitizeOptions {
    const transformTags: SanitizeOptions['transformTags'] = {
      a: (tagName, attribs) => {
        this.transformLinkAttributes(attribs);

        return {
          tagName,
          attribs,
        };
      },
    };

    for (const tag of TELEGRAM_TAGS_TO_UNWRAP) {
      transformTags[tag] = sanitizeHtml.simpleTransform('', {});
    }

    return {
      allowedTags: TELEGRAM_ALLOWED_TAGS,
      transformTags,
    };
  }

  static transformLinkAttributes(attribs: SanitizeAttributes) {
    this.transformRelativeToAbsoluteLink(attribs);
    this.transformDecodeLink(attribs);
  }

  static transformDecodeLink(attribs: SanitizeAttributes) {
    if (attribs.href) {
      attribs.href = decodeURI(attribs.href);
    }
  }

  static transformRelativeToAbsoluteLink(attribs: SanitizeAttributes) {
    const { language } = useI18n();

    if (attribs.href && attribs.rel === 'mw:WikiLink') {
      const urlObj = new URL(attribs.href, WikiSites.getBaseURL(language));

      attribs.href = urlObj.toString();

      delete attribs.rel;
    }
  }

  static truncateHtml(content: string, ellipsis = '...') {
    return truncateHtml(content, {
      keepWhitespaces: true,
      length: TELEGRAM_MAX_CONTENT_LENGTH,
      ellipsis,
    });
  }
}
