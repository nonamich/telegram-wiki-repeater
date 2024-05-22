import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { WikiNews } from '~/modules/wiki/interfaces';

import { TELEGRAM_TAG_DANGEROUSLY_HTML } from '../../telegram.constants';
import { BR, HTags, Links } from '../components';

export type NewsProps = {
  news: WikiNews[];
};

export const News: FunctionalComponent<NewsProps> = ({ news }) => {
  const { t } = useI18n();

  return (
    <>
      🆕 {t('in_the_news')}
      <BR />
      {news.map(({ story }, index) => {
        return (
          <>
            {index > 0 && <BR />}•{' '}
            <TELEGRAM_TAG_DANGEROUSLY_HTML
              dangerouslySetInnerHTML={{ __html: story }}
            />
          </>
        );
      })}
      <BR />
      <HTags tags={['news']} />
      <BR />
      <Links />
    </>
  );
};
