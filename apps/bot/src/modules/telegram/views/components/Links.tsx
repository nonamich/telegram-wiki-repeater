import { FunctionalComponent } from 'preact';

import { useI18n, useSite } from '~/modules/telegram/views/hooks';

import { List } from './List';

type Link = {
  text: string;
  url: string;
};

export type LinksProps = {
  links?: Link | Link[];
};

export const Links: FunctionalComponent<LinksProps> = ({ links: link }) => {
  const { t } = useI18n();
  const { donateURL } = useSite();
  const links = [
    {
      text: `💸 ${t('support_wikipedia')}`,
      url: donateURL,
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
