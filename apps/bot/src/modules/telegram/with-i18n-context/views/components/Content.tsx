import { FunctionalComponent } from 'preact';

import { TELEGRAM_TAG_DANGEROUSLY_HTML } from '~/modules/telegram/telegram.constants';
import { TelegramViewsUtils } from '~/modules/telegram/with-i18n-context/views/telegram.view.utils';

export type ContentProps = {
  content: string;
  source?: string;
};

export const Content: FunctionalComponent<ContentProps> = ({ content }) => {
  content = TelegramViewsUtils.getPreparedContent(content);

  return (
    <TELEGRAM_TAG_DANGEROUSLY_HTML
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
