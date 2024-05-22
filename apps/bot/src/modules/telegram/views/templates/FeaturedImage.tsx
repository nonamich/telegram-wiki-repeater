import { FunctionComponent } from 'preact';

import { WikiFeaturedImage } from '~/modules/wiki/interfaces';

import { BR, Content, HTags, Links, Title } from '../components';

export type FeaturedImageProps = {
  image: WikiFeaturedImage;
};

export const FeaturedImage: FunctionComponent<FeaturedImageProps> = ({
  image,
}) => {
  const title = image.title.replace(/^File:|\.(png|jpg|svg)$/g, '');

  return (
    <>
      <Title title={title} url={image.file_page} beforeTitle="🖼️" />
      <BR />
      <Content content={image.description.html} source={image.file_page} />
      <BR />
      <HTags tags={['image']} />
      <BR />
      <Links source={image.file_page} />
    </>
  );
};
