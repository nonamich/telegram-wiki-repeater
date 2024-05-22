import dayjs from 'dayjs';
import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { WikiOnThisDay } from '~/modules/wiki/interfaces';

import { BR, Description, HTags, Links, NewLine, Title } from '../components';
import { MAX_PAGES_PER_EVENT } from '../telegram.view.constants';
import { Article } from './Article';

export type OnThisDayProps = {
  event: WikiOnThisDay;
};

const icon = '🏺';

export const OnThisDay: FunctionalComponent<OnThisDayProps> = ({
  event: { pages, text, year },
}) => {
  const { language } = useI18n();
  const date = dayjs().locale(language).year(year);
  const tags = ['on_this_day', date.format('DD MMMM')];

  if (pages.length < 2) {
    const article = pages.at(0)!;

    return <Article article={article} beforeTitle={icon} tags={tags} />;
  }

  return (
    <>
      <strong>
        {icon} {date.format('DD MMMM YYYY')}
      </strong>
      {' — '}
      {text}
      <BR />
      {pages.slice(0, MAX_PAGES_PER_EVENT).map((page, index) => {
        return (
          <>
            {index > 0 && <NewLine />}•{' '}
            <Title
              title={page.titles.normalized}
              url={page.content_urls.mobile.page}
            />
            <Description description={page.description} />
          </>
        );
      })}
      <BR />
      <HTags tags={tags} />
      <BR />
      <Links />
    </>
  );
};
