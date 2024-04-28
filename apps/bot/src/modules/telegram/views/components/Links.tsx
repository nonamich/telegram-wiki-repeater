import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { WIKI_DONATE_SHORT_URL } from '~/modules/wiki/wiki.constants';

type Props = {
  source?: string;
};

export const Links: FunctionalComponent<Props> = ({ source }) => {
  const { t, language } = useI18n();
  const links = [
    {
      text: `💸 ${t('support_wikipedia')}`,
      url: `${WIKI_DONATE_SHORT_URL}/${language}`,
    },
  ];

  if (source) {
    links.unshift({
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
