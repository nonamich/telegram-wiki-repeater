import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { TELEGRAM_TAG_DANGEROUSLY_HTML } from '~/modules/telegram/telegram.constants';
import { TelegramViewsUtils } from '~/modules/telegram/views/telegram.view.utils';

export type ContentProps = {
  content: string;
  source?: string;
};

const getEllipsis = (source?: string) => {
  if (source) {
    const { t } = useI18n();

    return `... <a href=${source}>[${t('read_more').toLocaleLowerCase()}]</a>`;
  }

  return '...';
};

export const Content: FunctionalComponent<ContentProps> = ({
  content,
  source,
}) => {
  content = TelegramViewsUtils.truncateHtml(content, getEllipsis(source));

  return (
    <TELEGRAM_TAG_DANGEROUSLY_HTML
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
