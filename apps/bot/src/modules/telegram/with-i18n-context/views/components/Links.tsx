import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { WIKI_DONATE_SHORT_URL } from '~/modules/wiki/wiki.constants';

export type LinksProps = {
  source?: string;
};

export const Links: FunctionalComponent<LinksProps> = ({ source }) => {
  const { t, language } = useI18n();
  const links = [
    {
      text: `💸 ${t('support_wikipedia')}`,
      url: `${WIKI_DONATE_SHORT_URL}/${language}`,
    },
  ];

  if (source) {
    links.push({
      text: `🔗 ${t('source')}`,
      url: source,
    });
  }

  return (
    <>
      {links.map(({ url, text }, index) => {
        return (
          <>
            {index > 0 && ' | '}
            <a key={url} href={url}>
              {text}
            </a>
          </>
        );
      })}
    </>
  );
};
