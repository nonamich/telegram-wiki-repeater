import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';

import { Tag } from '../telegram.views.type';

export type HTagsProps = {
  tags: Tag[];
};

export const HTags: FunctionalComponent<HTagsProps> = ({ tags }) => {
  const { t } = useI18n();

  if (!tags.length) {
    return <></>;
  }

  const tagsString = tags.map((tag) => {
    switch (tag) {
      case 'image':
      case 'tfa':
      case 'mostread':
      case 'news':
      case 'on_this_day':
        tag = t(`tags.${tag}`);

        break;
    }

    return tag.replaceAll(' ', '_').toLocaleLowerCase();
  });

  return (
    <>
      {tagsString.map((tag, index) => {
        return (
          <>
            {index > 0 && ' '}#{tag}
          </>
        );
      })}
    </>
  );
};
