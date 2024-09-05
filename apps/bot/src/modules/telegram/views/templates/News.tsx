import { FunctionalComponent } from 'preact';

import { TELEGRAM_DANGEROUSLY_HTML_TAG } from '~/modules/telegram/telegram.constants';
import { WikiNews } from '~/modules/wiki/types';
import { WikiSites } from '~/modules/wiki/wiki.sites';

import { BR, Links } from '../components';
import { useI18n } from '../hooks';

export type NewsProps = {
  news: WikiNews;
};

export const News: FunctionalComponent<NewsProps> = ({ news: { story } }) => {
  const { t, language } = useI18n();
  const link = {
    text: t('current_events'),
    url: WikiSites.getCurrentEventsURL(language),
  };

  return (
    <>
      📰 {t('in_the_news')}
      {' — '}
      <TELEGRAM_DANGEROUSLY_HTML_TAG
        dangerouslySetInnerHTML={{ __html: story }}
      />
      <BR />
      <Links links={link} />
    </>
  );
};
