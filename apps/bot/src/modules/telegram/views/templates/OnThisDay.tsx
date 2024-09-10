import dayjs from 'dayjs';
import { FunctionalComponent } from 'preact';

import { Utils } from '@repo/shared';

import { useI18n, useSite } from '~/modules/telegram/views/hooks';
import { WikiOnThisDay } from '~/modules/wiki/types';
import { WikiSites } from '~/modules/wiki/wiki.sites';

import { BR, Content, Description, Links, NewLine, Title } from '../components';

export type OnThisDayProps = {
  event: WikiOnThisDay;
  pageIdWithImage?: number;
};

type EventsProps = Pick<WikiOnThisDay, 'pages'> &
  Pick<OnThisDayProps, 'pageIdWithImage'>;

const icon = '🏛️';

const Events: FunctionalComponent<EventsProps> = ({
  pages,
  pageIdWithImage,
}) => {
  const { isRTL } = useSite();
  const { t } = useI18n();
  const isSingle = pages.length === 1;
  const semicolon = isRTL ? '؛' : ';';

  return (
    <>
      {pages.map((page, index) => {
        const isContent = isSingle && !page.description;
        const isTitleImage = page.pageid === pageIdWithImage;

        if (!isSingle && isTitleImage) {
          page.description = `${page.description ? `${page.description}. ` : ''}[${t('picture').toLowerCase()}]`;
        }

        return (
          <>
            {!isSingle && <>{index > 0 && <NewLine />}• </>}
            {!isContent && (
              <Title
                title={page.titles.normalized}
                url={page.content_urls.desktop.page}
              />
            )}
            {!isSingle && !page.description && <>{semicolon}</>}
            {page.description && (
              <Description
                description={page.description}
                hyphen="-"
                end={semicolon}
              />
            )}
            {isContent && (
              <Content
                content={page.extract_html}
                source={page.content_urls.desktop.page}
              />
            )}
          </>
        );
      })}
    </>
  );
};

export const OnThisDay: FunctionalComponent<OnThisDayProps> = ({
  event: { pages, text, year },
  pageIdWithImage,
}) => {
  const { language, t } = useI18n();
  const date = dayjs().locale(language).year(year);
  const links = [
    {
      text: t('more_events'),
      url: WikiSites.getOnThisDayURL(language),
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
      {Boolean(pages.length) && (
        <>
          <BR />
          <Events pages={pages} pageIdWithImage={pageIdWithImage} />
        </>
      )}
      <BR />
      <Links links={links} />
    </>
  );
};
