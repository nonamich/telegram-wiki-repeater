import dayjs from 'dayjs';
import { FunctionalComponent } from 'preact';

import { Utils } from '@repo/shared';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { WikiOnThisDay } from '~/modules/wiki/types';
import { WikiHelper } from '~/modules/wiki/wiki.helper';

import { BR, Content, Description, Links, NewLine, Title } from '../components';

export type OnThisDayProps = {
  event: WikiOnThisDay;
};

type EventsProps = Pick<WikiOnThisDay, 'pages'>;

const semicolon = ';';
const icon = '🏛️';

const Events: FunctionalComponent<EventsProps> = ({ pages }) => {
  const isSingle = pages.length === 1;

  return (
    <>
      {pages.map((page, index) => {
        const isHtml = isSingle && !page.description;

        return (
          <>
            {!isSingle && <>{index > 0 && <NewLine />}• </>}
            {!isHtml && (
              <Title
                title={page.titles.normalized}
                url={page.content_urls.desktop.page}
              />
            )}
            {!isSingle && !page.description && semicolon}
            {page.description && (
              <Description
                description={page.description}
                hyphen="-"
                end={semicolon}
              />
            )}
            {isHtml && (
              <>
                <Content
                  content={page.extract_html}
                  source={page.content_urls.desktop.page}
                />
              </>
            )}
          </>
        );
      })}
    </>
  );
};

export const OnThisDay: FunctionalComponent<OnThisDayProps> = ({
  event: { pages, text, year },
}) => {
  const { language, t } = useI18n();
  const date = dayjs().locale(language).year(year);
  const links = [
    {
      text: t('more_events'),
      url: WikiHelper.getOnThisDayURL(language),
    },
  ];
  const isSingle = pages.length === 1 && !pages[0].description;

  if (isSingle) {
    links.push({
      text: t('source'),
      url: pages[0].content_urls.desktop.page,
    });
  }

  return (
    <>
      {icon} {Utils.capitalizeFirstLetter(text)} ({date.format('DD MMMM YYYY')})
      <BR />
      <Events pages={pages} />
      <BR />
      <Links links={links} />
    </>
  );
};
