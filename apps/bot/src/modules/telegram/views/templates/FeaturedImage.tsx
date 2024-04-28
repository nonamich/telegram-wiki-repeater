import { FunctionComponent } from 'preact';

import { WikiImageFeatured } from '~/modules/wiki/interfaces';

import { BR, Content, HTags, Links, Title } from '../components';

export type Props = {
  image: WikiImageFeatured;
};

export const FeaturedImage: FunctionComponent<Props> = ({ image }) => {
  return (
    <>
      <Title title={image.title} url={image.file_page} icon="🖼️" />
      <BR />
      <Content content={image.description.html} source={image.file_page} />
      <BR />
      <HTags tags={['image']} />
      <BR />
      <Links source={image.file_page} />
    </>
  );
};
