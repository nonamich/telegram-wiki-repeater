import { Injectable } from '@nestjs/common';

import { VNode } from 'preact';
import { renderToString } from 'preact-render-to-string';

import { TelegramViewsUtils } from './telegram.view.utils';
import {
  FeaturedImage,
  FeaturedImageProps,
  News,
  NewsProps,
  OnThisDay,
  OnThisDayProps,
  MostReadProps,
  MostRead,
  FeaturedArticle,
  FeaturedArticleProps,
} from './templates';

@Injectable()
export class TelegramViews {
  renderToString(node: VNode) {
    const unsanitizeHtml = renderToString(<>{node}</>);
    const html = TelegramViewsUtils.getSanitizedHTML(unsanitizeHtml);

    return html;
  }

  renderFeaturedImage(props: FeaturedImageProps) {
    return this.renderToString(<FeaturedImage {...props} />);
  }

  renderFeaturedArticle(props: FeaturedArticleProps) {
    return this.renderToString(<FeaturedArticle {...props} />);
  }

  renderNews(props: NewsProps) {
    return this.renderToString(<News {...props} />);
  }

  renderOnThisDay(props: OnThisDayProps) {
    return this.renderToString(<OnThisDay {...props} />);
  }

  renderMostRead(props: MostReadProps) {
    return this.renderToString(<MostRead {...props} />);
  }
}
