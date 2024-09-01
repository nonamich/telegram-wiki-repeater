import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';
import { WikiHelper } from '~/modules/wiki/wiki.helper';

import { List } from './List';

type Link = {
  text: string;
  url: string;
};

export type LinksProps = {
  links?: Link | Link[];
};

export const Links: FunctionalComponent<LinksProps> = ({ links: link }) => {
  const { t, language } = useI18n();
  const links = [
    {
      text: `💸 ${t('support_wikipedia')}`,
      url: WikiHelper.sites[language].donate,
    },
  ];

  if (link) {
    if (!Array.isArray(link)) {
      link = [link];
    }

    links.push(...link);
  }

  return (
    <List
      items={links}
      separator=" | "
      each={({ text, url }, index) => (
        <a key={index} href={url}>
          {text}
        </a>
      )}
    />
  );
};
