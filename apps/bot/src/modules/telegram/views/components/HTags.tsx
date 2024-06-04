import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';

import { Tag } from '../telegram.views.type';
import { List } from './List';

export type HTagsProps = {
  tags: Tag[];
};

export const HTags: FunctionalComponent<HTagsProps> = ({ tags }) => {
  if (!tags.length) {
    return <></>;
  }

  const sanitizedTags = tags.map(tryTranslateText).map(tagToSnakeCase);

  return (
    <List
      items={sanitizedTags}
      separator=" "
      each={(item) => {
        return <>#{item}</>;
      }}
    />
  );
};

const tagToSnakeCase = (tag: string) => {
  return tag.replaceAll(' ', '_').toLocaleLowerCase();
};

const tryTranslateText = (tag: string) => {
  const { t } = useI18n();

  switch (tag) {
    case 'image':
    case 'tfa':
    case 'mostread':
    case 'news':
    case 'on_this_day':
      tag = t(`tags.${tag}`);

      break;
  }

  return tag;
};
