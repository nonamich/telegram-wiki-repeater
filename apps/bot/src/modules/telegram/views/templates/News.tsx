import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { TELEGRAM_TAG_DANGEROUSLY_HTML } from '~/modules/telegram/telegram.constants';
import { WikiNews } from '~/modules/wiki/types';
import { WikiHelper } from '~/modules/wiki/wiki.helper';

import { BR, Links } from '../components';

export type NewsProps = {
  news: WikiNews;
};

export const News: FunctionalComponent<NewsProps> = ({ news: { story } }) => {
  const { t, language } = useI18n();
  const link = {
    text: t('current_events'),
    url: WikiHelper.getCurrentEventsURL(language),
  };

  return (
    <>
      📰 {t('in_the_news')}
      {' — '}
      <TELEGRAM_TAG_DANGEROUSLY_HTML
        dangerouslySetInnerHTML={{ __html: story }}
      />
      <BR />
      <Links links={link} />
    </>
  );
};
