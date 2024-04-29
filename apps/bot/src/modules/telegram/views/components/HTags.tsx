import dayjs from 'dayjs';
import { FunctionalComponent } from 'preact';

import { useI18n } from '~/modules/i18n/i18n.utils';

import { TypeOfArticle } from '../telegram.views.type';

export type HTagsProps = {
  tags: (TypeOfArticle | Date)[];
};

export const HTags: FunctionalComponent<HTagsProps> = ({ tags }) => {
  const { t, language } = useI18n();

  if (!tags.length) {
    return <></>;
  }

  const tagsString = tags.map((tag) => {
    let tagString: string;

    if (tag instanceof Date) {
      const date = dayjs(tag).locale(language);

      tagString = date.format('DD_MMMM_YYYY');
    } else {
      tagString = t(`tags.${tag}`);
    }

    return tagString.replaceAll(' ', '_');
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
