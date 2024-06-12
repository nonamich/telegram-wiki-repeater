import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { WIKI_DONATE_SHORT_URL } from '~/modules/wiki/wiki.constants';

import { List } from './List';

type Link = {
  text: string;
  url: string;
};

export type LinksProps = {
  link?: Link;
};

export const Links: FunctionalComponent<LinksProps> = ({ link }) => {
  const { t, language } = useI18n();
  const links = [
    {
      text: `💸 ${t('support_wikipedia')}`,
      url: `${WIKI_DONATE_SHORT_URL}/${language}`,
    },
  ];

  if (link) {
    links.push(link);
  }

  return (
    <List
      items={links}
      separator=" | "
      each={({ text, url }) => (
        <a key={url} href={url}>
          {text}
        </a>
      )}
    />
  );
};
