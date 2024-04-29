import { Injectable } from '@nestjs/common';

import { VNode } from 'preact';
import { renderToString } from 'preact-render-to-string';

import { TelegramViewsUtils } from './telegram.view.utils';
import {
  FeaturedImage,
  FeaturedImageProps,
  ArticleList,
  ArticleListProps,
  Article,
  ArticleProps,
} from './templates';

@Injectable()
export class TelegramViews {
  renderToString(node: VNode) {
    const unsanitizeHtml = renderToString(node);
    const html = TelegramViewsUtils.getSanitizedHTML(unsanitizeHtml);

    return html;
  }

  renderFeaturedImage(props: FeaturedImageProps) {
    return this.renderToString(<FeaturedImage {...props} />);
  }

  renderArticle(props: ArticleProps) {
    return this.renderToString(<Article {...props} />);
  }

  renderArticleList(props: ArticleListProps) {
    return this.renderToString(<ArticleList {...props} />);
  }
}
