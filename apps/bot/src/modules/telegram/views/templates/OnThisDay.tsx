import dayjs from 'dayjs';
import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { WikiOnThisDay } from '~/modules/wiki/types';
import { WikiHelper } from '~/modules/wiki/wiki.helper';

import { BR, Description, Links, NewLine, Title } from '../components';
import { Article } from '../components/Article';

export type OnThisDayProps = {
  event: WikiOnThisDay;
};

const icon = '🏛️';

export const OnThisDay: FunctionalComponent<OnThisDayProps> = ({
  event: { pages, text, year },
}) => {
  const { language, t } = useI18n();
  const date = dayjs().locale(language).year(year);
  const link = {
    text: t('more_events'),
    url: WikiHelper.getOnThisDayURL(language),
  };
  const isSingle = pages.length === 1;

  return (
    <>
      <strong>
        {icon} {date.format('DD MMMM YYYY')}
      </strong>
      {' — '}
      {text}
      <BR />
      {isSingle && <Article article={pages.at(0)!} link={link} />}
      {!isSingle && (
        <>
          {pages.map((page, index) => {
            return (
              <>
                {index > 0 && <NewLine />}•{' '}
                <Title
                  title={page.titles.normalized}
                  url={page.content_urls.desktop.page}
                />
                <Description description={page.description} hyphen="-" />;
              </>
            );
          })}
          <BR />
          <Links link={link} />
        </>
      )}
    </>
  );
};
