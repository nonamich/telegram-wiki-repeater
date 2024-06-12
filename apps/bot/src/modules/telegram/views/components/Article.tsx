import { FunctionComponent } from 'preact';
import { JSXInternal } from 'preact/src/jsx';

import { WikiArticle } from '~/modules/wiki/types';

import { BR, Content, Description, Links, LinksProps, Title } from '.';

type ArticleProps = {
  article: WikiArticle;
  beforeTitle?: JSXInternal.Element | string;
  link?: LinksProps['link'];
};

export const Article: FunctionComponent<ArticleProps> = ({
  article,
  beforeTitle,
  link,
}) => {
  return (
    <>
      <Title
        title={article.titles.normalized}
        url={article.content_urls.mobile.page}
        beforeTitle={beforeTitle}
      />
      <Description description={article.description} />
      <BR />
      <Content content={article.extract_html} />
      <BR />
      <Links link={link} />
    </>
  );
};
