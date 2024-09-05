import { Injectable } from '@nestjs/common';
import { Attributes, VNode, h } from 'preact';
import { renderToStringAsync } from 'preact-render-to-string';

import { TelegramViewsUtils } from './telegram.view.utils';
import {
  FeaturedImage,
  FeaturedImageProps,
  News,
  NewsProps,
  OnThisDay,
  OnThisDayProps,
  FeaturedArticle,
  FeaturedArticleProps,
} from './templates';

@Injectable()
export class TelegramViews {
  async renderToString<T>(vNode: VNode<Attributes & T>) {
    const unsanitizeHtml = await renderToStringAsync(vNode);
    const html = TelegramViewsUtils.getSanitizedHTML(unsanitizeHtml);

    return html;
  }

  renderFeaturedImage(props: FeaturedImageProps) {
    return this.renderToString(h(FeaturedImage, props));
  }

  renderFeaturedArticle(props: FeaturedArticleProps) {
    return this.renderToString(h(FeaturedArticle, props));
  }

  renderNews(props: NewsProps) {
    return this.renderToString(h(News, props));
  }

  renderOnThisDay(props: OnThisDayProps) {
    return this.renderToString(h(OnThisDay, props));
  }
}
