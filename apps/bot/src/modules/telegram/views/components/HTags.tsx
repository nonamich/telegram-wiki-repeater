import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';

type A = 'image';

type Props = {
  tags: (A | Date)[];
};

export const HTags: FunctionalComponent<Props> = ({ tags }) => {
  const { t } = useI18n();

  const tagsString = tags.map((tag) => {
    let tagString: string;

    if (tag instanceof Date) {
      tagString = tag.toString();
    } else {
      switch (tag) {
        case 'image':
          tagString = t('tags.image');

          break;
      }
    }

    return tagString;
  });

  return (
    <>
      {tagsString.map((tag) => {
        return `#${tag}`;
      })}
    </>
  );
};
