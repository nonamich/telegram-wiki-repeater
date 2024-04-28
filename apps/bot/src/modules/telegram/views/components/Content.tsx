import { FunctionalComponent } from 'preact';

import { TELEGRAM_TAG_DANGEROUSLY_HTML } from '~/modules/telegram/telegram.constants';
import { TelegramViewsUtils } from '~/modules/telegram/views/telegram.view.utils';

type Props = {
  content: string;
  source?: string;
};

export const Content: FunctionalComponent<Props> = ({ content }) => {
  content = TelegramViewsUtils.getPreparedContent(content);

  return (
    <TELEGRAM_TAG_DANGEROUSLY_HTML
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
