import { FunctionComponent } from 'preact';

import { useI18n } from '~/modules/telegram/views/hooks';
import { WikiFeaturedImage } from '~/modules/wiki/types';
import { WikiSites } from '~/modules/wiki/wiki.sites';

import { BR, Content, Links, Title } from '../components';

export type FeaturedImageProps = {
  image: WikiFeaturedImage;
};

export const FeaturedImage: FunctionComponent<FeaturedImageProps> = ({
  image,
}) => {
  const title = image.title.replace(/^File:|\.(png|jpg|svg)$/g, '');
  const { language, t } = useI18n();
  const link = {
    url: WikiSites.getFeaturedPicturesURL(language),
    text: t('more_featured_pictures'),
  };

  return (
    <>
      🖼️ <Title title={title} url={image.file_page} />
      {image.description && (
        <>
          <BR />
          <Content content={image.description.html} source={image.file_page} />
        </>
      )}
      <BR />
      <Links links={link} />
    </>
  );
};
