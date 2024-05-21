import { FunctionalComponent } from 'preact';

import { TELEGRAM_TAG_DANGEROUSLY_HTML } from '../../telegram.constants';
import { BR, HTags, HTagsProps, Links, LinksProps } from '../components';

export type ArticleListProps = {
  title: string;
  list: string[];
  tags: HTagsProps['tags'];
  source?: LinksProps['source'];
};

export const ArticleList: FunctionalComponent<ArticleListProps> = ({
  title,
  list,
  tags,
  source,
}) => {
  return (
    <>
      <TELEGRAM_TAG_DANGEROUSLY_HTML
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <BR />
      {list.map((item, index) => {
        return (
          <>
            {index > 0 && <BR />}•{' '}
            <strong>
              <TELEGRAM_TAG_DANGEROUSLY_HTML
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </strong>
          </>
        );
      })}
      <BR />
      <HTags tags={tags} />
      <BR />
      <Links source={source} />
    </>
  );
};
